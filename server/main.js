const io = require('socket.io');
const server = io.listen(4444);
const striptags = require('striptags');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


server.on('connection', (socket) => {
    console.log('A farmer has connected');

    socket.on('createFarm', (name, password) => {
        createFarm(striptags(name), striptags(password), socket, io)
    });

    socket.on('joinFarm', (id, password) => {
        joinFarm(striptags(id), striptags(password), socket, io)
    });

    socket.on('updateBlock', (farmid, row, column, name) => {
        console.log(farmid, row, column)
        updateBlock(striptags(farmid), row, column, name, socket, io)
    });
    
    socket.on('plantCrop', (farmid, row, column, cropid) => {
        console.log("Planting crop:",farmid, row, column, cropid)
        plantCrop(striptags(farmid), row, column, cropid, socket, io)
    })
})


async function createFarm(name, pass, socket, io) {

    var date = Date.now().toString();
    var id = date.substring(date.length - 6, date.length);
    var grid = { blocks: [], gridID: id };

    for (let r = 0; r < 20; r++) {
        grid.blocks.push([]);
        for (let c = 0; c < 25; c++) {
            const obj = {
                row: r,
                column: c,
                crop: -1,
                prepared: false,
                ready: false,
                selected: false,
                name: 'grass'
            }
            grid.blocks[r].push(obj);
        }
    }

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");

        var farmObj = { id: id, name: name, money: 100, password: pass };

        dbo.collection("farms").insertOne(farmObj, function (err, res) {
            if (err) throw err;
            console.log(`Farm inserted ${name}, ${id}`);
            db.close();
        });



        dbo.collection("blocks").insertOne(grid, function (err, res) {
            if (err) throw err;
            console.log(`Grid inserted`);
            db.close();
            console.log("Farm created")
            socket.emit('farmCreated', id, pass);
        });

        dbo.collection("farms").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(`farms: `);
            console.log(result);
            db.close();
        });

    });


}
async function joinFarm(id, pass, socket, io) {

    var data = { error: "Farm not found", grid: [], settings: {} };

    console.log("Joining farm: " + id + ":" + pass);

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");

        var query = { id: id, password: pass };
        dbo.collection("farms").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log('farm found')
            data.settings = result;
            db.close();
        });

        var query = { gridID: id };
        dbo.collection("blocks").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log('Blocks found')
            data.grid = result;
            data.error = null;
            db.close();

            // Let farmer join room
            socket.join(id.toString())
            // Send back the data
            server.to(id.toString()).emit('farmerJoined', socket.id);
            socket.emit('farmJoined', data);

        });

    })

}

async function updateBlock(farmid, row, column, name, socket, io) {

    console.log(`Editing block at ${row}X${column} for farm ${farmid}`);
    var grid;
    var query = { gridID: farmid };

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");

        dbo.collection("blocks").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log('Blocks found')
            const block = result[0].blocks[row][column];
            grid = result[0].blocks;
            db.close();

            grid[row][column].name = name;
            grid[row][column].prepared = true;

            sendBlock(farmid, query, grid, row, column)
        });

    });

}

function sendBlock(farmid, query, grid, row, column) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");

        dbo.collection("blocks").updateOne(query, { $set: { blocks: grid } }, function (err, res) {
            if (err) throw err;
            console.log("Block updated: " + res);
            server.to(farmid.toString()).emit('singleBlockUpdate', row, column);
            db.close();
        });
    });
}

function sendCropBlock(farmid, query, grid, row, column, cropid) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");

        dbo.collection("blocks").updateOne(query, { $set: { blocks: grid } }, function (err, res) {
            if (err) throw err;
            console.log("Block updated: " + res);
            server.to(farmid.toString()).emit('singleCropBlockUpdate', row, column, cropid);
            db.close();
        });
    });
}

async function plantCrop(farmid, row, column, cropid, socket, io) {

    console.log(`Planting crop at ${row}X${column} for farm ${farmid}`);
    var grid;
    var query = { gridID: farmid };

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");

        dbo.collection("blocks").find(query).toArray(function (err, result) {
            if (err) throw err;
            const block = result[0].blocks[row][column];
            grid = result[0].blocks;
            db.close();

            // Check if block is prepared and there is no crop
            if (grid[row][column].prepared && grid[row][column].crop == -1) {
                grid[row][column].crop = cropid;
                console.log('Crop planted: ')
                console.log(grid[row][column])
                sendCropBlock(farmid, query, grid, row, column, cropid);
            }

        });

    });

}