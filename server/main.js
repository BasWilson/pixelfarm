const io = require('socket.io');
const server = io.listen(4444);
const striptags = require('striptags');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const crops = [
    {
        'name': 'corn',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🌽',
        'growTime': 30
    },
    {
        'name': 'grape',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍇',
        'growTime': 40
    },
    {
        'name': 'watermelon',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍉',
        'growTime': 45
    },
    {
        'name': 'carrot',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🥕',
        'growTime': 20
    },
    {
        'name': 'cucumber',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🥒',
        'growTime': 25
    },
    {
        'name': 'eggplant',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍆',
        'growTime': 25
    },
    {
        'name': 'potato',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🥔',
        'growTime': 15
    },
    {
        'name': 'broccoli',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🥦',
        'growTime': 28
    }
]

// When a client connects
server.on('connection', (socket) => {
    console.log('A farmer has connected');

    // if client wants to create a farm
    socket.on('createFarm', (name, password) => {
        createFarm(striptags(name), striptags(password), socket, io)
    });

    // if client wants to join an existing farm
    socket.on('joinFarm', (id, password) => {
        joinFarm(striptags(id), striptags(password), socket, io)
    });

    // when the client updates a block
    socket.on('updateBlock', (farmid, row, column, name) => {
        console.log(farmid, row, column)
        updateBlock(striptags(farmid), row, column, name, socket, io)
    });

    // When a crop is planted
    socket.on('plantCrop', (farmid, row, column, cropid) => {
        console.log("Planting crop:", farmid, row, column, cropid)
        plantCrop(striptags(farmid), row, column, cropid, socket, io)
    })
})


async function createFarm(name, pass, socket, io) {

    // Get the last 6 digits of the timestamp
    var date = Date.now().toString();
    var id = date.substring(date.length - 6, date.length);
    var grid = { blocks: [], gridID: id };

    // create the 20 rows
    for (let r = 0; r < 20; r++) {
        // push them all as arrays
        grid.blocks.push([]);
        // Create the 25 columns
        for (let c = 0; c < 25; c++) {
            // Set their properties
            const obj = {
                row: r,
                column: c,
                crop: -1,
                prepared: false,
                ready: false,
                selected: false,
                name: 'grass',
                growTime: 0,
                startedGrowing: 0
            }
            // Push 25 blocks into every row
            grid.blocks[r].push(obj);
        }
    }

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        // Connect to db
        var dbo = db.db("farm");

        // Create the new farm obj with the data
        var farmObj = { id: id, name: name, money: 100, password: pass };

        // insert the farm settings
        dbo.collection("farms").insertOne(farmObj, function (err, res) {
            if (err) throw err;
            console.log(`Farm inserted ${name}, ${id}`);
            db.close();
        });


        // Insert the blocks for this farm
        dbo.collection("blocks").insertOne(grid, function (err, res) {
            if (err) throw err;
            console.log(`Grid inserted`);
            db.close();
            console.log("Farm created")
            socket.emit('farmCreated', id, pass);
        });

        // Log all farms for simple use
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

        // Try to find if there is a farm with this id and pass
        var query = { id: id, password: pass };
        dbo.collection("farms").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log('farm found')
            // set the settings to the result
            data.settings = result;
            db.close();
        });

        var query = { gridID: id };
        // Find the blocks data for this farm
        dbo.collection("blocks").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log('Blocks found')
            data.grid = result;
            data.error = null;
            db.close();

            // Let farmer join socket.io room for this farm
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
        // find the blocks
        dbo.collection("blocks").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log('Blocks found')
            const block = result[0].blocks[row][column];
            grid = result[0].blocks;
            db.close();

            // edit the block
            grid[row][column].name = name;
            grid[row][column].prepared = true;

            //save and emit the block
            sendBlock(farmid, query, grid, row, column)
        });

    });

}

function sendBlock(farmid, query, grid, row, column) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");
        // Update the blocks
        dbo.collection("blocks").updateOne(query, { $set: { blocks: grid } }, function (err, res) {
            if (err) throw err;
            console.log("Block updated: " + res);
            // Emit to the room that a block has been updated
            server.to(farmid.toString()).emit('singleBlockUpdate', row, column);
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

        // Find the blocks
        dbo.collection("blocks").find(query).toArray(function (err, result) {
            if (err) throw err;
            const block = result[0].blocks[row][column];
            grid = result[0].blocks;
            db.close();

            // Check if block is prepared and there is no crop
            if (grid[row][column].prepared && grid[row][column].crop == -1) {
                // set the properties of the block
                grid[row][column].crop = cropid;
                grid[row][column].startedGrowing = Date.now();
                grid[row][column].growTime = crops[cropid].growTime;
                console.log('Crop planted: ')
                console.log(grid[row][column])
                // send it back
                sendCropBlock(farmid, query, grid, row, column, cropid);
            }

        });

    });

}

function sendCropBlock(farmid, query, grid, row, column, cropid) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");
        // update blocks with added crop
        dbo.collection("blocks").updateOne(query, { $set: { blocks: grid } }, function (err, res) {
            if (err) throw err;
            console.log("Block updated: " + res);
            // emit to the room that a block has been updated
            server.to(farmid.toString()).emit('singleCropBlockUpdate', row, column, cropid, grid[row][column].growTime, grid[row][column].startedGrowing);
            db.close();
        });
    });
}