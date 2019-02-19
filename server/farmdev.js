const io = require('socket.io');
const server = io.listen(5454);
const striptags = require('striptags');
const randomColor = require('randomcolor'); // import the script
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var players = [];
const crops = [
    {
        'name': 'potato',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🥔',
        'growTime': 15,
        'level': 0,
        'price': 1,
    },
    {
        'name': 'corn',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🌽',
        'growTime': 20,
        'level': 0,
        'price': 1.2,
    },
    {
        'name': 'carrot',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🥕',
        'growTime': 25,
        'level': 2,
        'price': 2,
    }, 
    {
        'name': 'red apple',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍎',
        'growTime': 28,
        'level': 4,
        'price': 2.2,
    },
    {
        'name': 'green apple',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍏',
        'growTime': 30,
        'level': 5,
        'price': 2.2,
    },
    {
        'name': 'cucumber',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🥒',
        'growTime': 32,
        'level': 8,
        'price': 2.5,
    },
    {
        'name': 'strawberry',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍓',
        'growTime': 40,
        'level': 10,
        'price': 2.5,
    }, 
    {
        'name': 'pear',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍐',
        'growTime': 55,
        'level': 14,
        'price': 3,
    },
    {
        'name': 'tomato',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍅',
        'growTime': 70,
        'level': 20,
        'price': 3.5,
    },

    {
        'name': 'broccoli',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🥦',
        'growTime': 110,
        'level': 28,
        'price': 4,
    },

    {
        'name': 'mushroom',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍄',
        'growTime': 140,
        'level': 34,
        'price': 5,
    },
    {
        'name': 'eggplant',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍆',
        'growTime': 170,
        'level': 42,
        'price': 6,
    },
    {
        'name': 'grape',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍇',
        'growTime': 200,
        'level': 55,
        'price': 8,

    },
    {
        'name': 'watermelon',
        'amount': 1,
        'use': plantCrop,
        'prematureIcon': '🌱',
        'icon': '🍉',
        'growTime': 250,
        'level': 70,
        'price': 10,
    },
]


// When a client connects
server.on('connection', (socket) => {
    console.log('A farmer has connected');

    // if client wants to create a farm
    socket.on('createFarm', (name, password) => {
        if (name && password)
            createFarm(striptags(name), striptags(password), socket, io)
    });

    // if client wants to join an existing farm
    socket.on('joinFarm', (id, password) => {
        if (id && password)
            joinFarm(striptags(id), striptags(password), socket, io)
    });

    // when the client updates a block
    socket.on('updateBlock', (farmid, row, column, name) => {
        if (farmid && name)
            updateBlock(striptags(farmid), row, column, name, socket, io)
    });

    // When a crop is planted
    socket.on('plantCrop', (farmid, row, column, cropName) => {
        if (farmid)
            plantCrop(striptags(farmid), row, column, cropName, socket, io)
    });

    // When a crop is planted
    socket.on('harvestCrop', (farmid, row, column) => {
        if (farmid)
            harvestCrop(striptags(farmid), row, column)
    });

    // Retrieve and send all marketplace dataa to client
    socket.on("retrieveShop", (farmId) => {
        retrieveShop(farmId);
    });

    // Retrieve and send all marketplace dataa to client
    socket.on("retrieveMarketplace", (farmId) => {
        retrieveMarketplace(farmId);
    });

    // Let client list an item on the marketplace
    socket.on("listOnMarketplace", (farmid, cropName) => {
        removeCropFromInventory(farmid, cropName);
    });

    // Let client buy an item from the marketplace
    socket.on("buyFromMarketplace", (farmid, listingId) => {
        buyFromMarketplace(farmid, listingId);
    });

    // Let client buy an item from the marketplace
    socket.on("buyFromShop", (farmid, itemId) => {
        buyFromShop(farmid, itemId);
    });

    socket.on("moveUpdate", (farmid, row, col) => {
        updatePlayerSpot(socket, farmid, row, col);
    });

    socket.on("retrieveInventory", (farmId) => {
        retrieveInventory(farmId);
    });
})

function updatePlayerSpot(socket, farmId, row, col) {

    for (let i = 0; i < players.length; i++) {
        if (players[i].farmId == farmId) {
            for (let z = 0; z < players[i].players.length; z++) {
                if (players[i].players[z].socketId == socket.id) {
                    players[i].players[z].row = row;
                    players[i].players[z].column = col;
                    server.to(farmId.toString()).emit('playerMoved', players[i].players[z]);
                    console.log(players[i].players[z])
                }
            }
        }
    }
}


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
        var farmObj = { id: id, name: name, money: 100, password: pass, exp: 1 };

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
        });

        const items = {
            items: [
                {
                    name: 'hoe'
                },
                {
                    name: 'scissors'
                }
            ],
            id: id
        }
        dbo.collection("itemInventories").insertOne(items, function (err, res) {
            if (err) throw err;
            console.log(`Items inserted`);
            db.close();
        });

        const crops = {
            crops: [
                {
                    'name': 'potato',
                    'amount': 1,
                    'use': '',
                    'prematureIcon': '🌱',
                    'icon': '🥔',
                    'growTime': 15
                },
                {
                    'name': 'corn',
                    'amount': 10,
                    'use': '',
                    'prematureIcon': '🌱',
                    'icon': '🌽',
                    'growTime': 30
                }
            ],
            id: id
        }
        dbo.collection("cropInventories").insertOne(crops, function (err, res) {
            if (err) throw err;
            console.log(`Crops inserted`);
            db.close().then(() => {
                console.log("Farm created")
                socket.emit('farmCreated', id, pass);
            });

        });

    });


}

async function joinFarm(id, pass, socket, io) {

    console.log(id, pass)
    var data = { error: "Farm not found", grid: [], settings: {}, cropInventory: {}, itemInventory: {} };

    console.log("Joining farm: " + id + ":" + pass);
    var errCount = 0;

    await MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");

        // Try to find if there is a farm with this id and pass
        var query = { id: id, password: pass };
        dbo.collection("farms").find(query).toArray(function (err, result) {
            if (err) {
                errCount++;
                throw err;
            }
            console.log('Farm found')
            // set the settings to the result
            data.settings = result;
            db.close();
        });

        var query = { gridID: id };
        // Find the blocks data for this farm
        dbo.collection("blocks").find(query).toArray(function (err, result) {
            if (err) {
                errCount++;
                throw err;
            } console.log('Blocks found')
            data.grid = result;
            data.error = null;
            db.close();
        });

        var query = { id: id };
        // Find the blocks data for this farm
        dbo.collection("cropInventories").find(query).toArray(function (err, result) {
            if (err) {
                errCount++;
                throw err;
            } console.log('Crop inv found')
            data.cropInventory = result;
            db.close();

        });

        var query = { id: id };
        // Find the blocks data for this farm
        dbo.collection("itemInventories").find(query).toArray(function (err, result) {
            if (err) {
                errCount++;
                throw err;
            } console.log('Item inv found')
            data.itemInventory = result;
            db.close();

            if (errCount == 0) {
                // Let farmer join socket.io room for this farm
                socket.join(id.toString())
                // Send back the data
                const playerObj = {
                    socketId: socket.id,
                    color: randomColor(),
                    row: 0,
                    column: 0
                }

                for (let i = 0; i < players.length; i++) {
                    if (players[i].farmId == id) {

                        players[i].players.push(playerObj);
                        server.to(id.toString()).emit('farmerJoined', socket.id);
                        socket.emit('farmJoined', data);
                        return;
                    }
                }
                players.push({
                    farmId: id,
                    players: [playerObj]
                })

                server.to(id.toString()).emit('farmerJoined', socket.id);
                socket.emit('farmJoined', data);
                return;

            }

        });


    })

}

async function harvestCrop(farmid, row, column) {

    console.log(`Harvesting block at ${row}X${column} for farm ${farmid}`);
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

            // See if its ready to be harvested
            console.log("Time left: " + (Date.now() - grid[row][column].startedGrowing));

            if ((Date.now() - grid[row][column].startedGrowing) > (grid[row][column].growTime * 1000) && grid[row][column].crop != -1) {
                //reward exp
                const exp = grid[row][column].growTime * 10 / 3;
                sendExpUpdate(farmid, exp);
            }
            // edit the block
            grid[row][column].name = 'dirt';
            grid[row][column].crop = -1;
            grid[row][column].prepared = true;
            grid[row][column].startedGrowing = 0;

            //save and emit the block
            sendBlock(farmid, query, grid, row, column)
        });

    });

}

async function sendExpUpdate(farmid, exp) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");
        var newExp = 0;

        var query = { id: farmid };
        dbo.collection("farms").find(query).toArray(function (err, result) {
            if (err) throw err;
            // set the settings to the result
            newExp = result[0].exp + exp;
            console.log('EXP TO BE ADDED: ' + exp)
            console.log('NEW EXP: ' + newExp)
            db.close();
            updateExp(farmid, query, newExp);
        });
    })

}

async function updateExp(farmid, query, exp) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");

        dbo.collection("farms").updateOne(query, { $set: { exp: exp } }, function (err, res) {
            if (err) throw err;
            console.log("Level updated: " + res);
            // Emit to the room that a block has been updated
            db.close();
            server.to(farmid.toString()).emit('updateExp', exp);
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
            grid[row][column].crop = -1;
            grid[row][column].ready = false;

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


async function plantCrop(farmid, row, column, cropName, socket, io) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");

        // Get all marketplace listings
        dbo.collection("cropInventories").find({ id: farmid }).toArray(function (err, result) {
            if (err) throw err;
            // set the settings to the result
            db.close().then(() => {
                for (let i = 0; i < result[0].crops.length; i++) {
                    if (result[0].crops[i].name == cropName && result[0].crops[i].amount > 0) {
                        console.log('found crop to place', result[0].crops[i])
                        console.log(`Planting crop at ${row}X${column} for farm ${farmid}`);
                        removeCropFromInventory(farmid, cropName);
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
                                    for (let c = 0; c < crops.length; c++) {
                                        if (crops[c].name == cropName) {
                                            grid[row][column].crop = cropName;
                                            grid[row][column].startedGrowing = Date.now();
                                            grid[row][column].growTime = crops[c].growTime;
                                            console.log('Crop planted: ')
                                            console.log(grid[row][column])
                                            // send it back
                                            sendCropBlock(farmid, query, grid, row, column, cropName);
                                            break;
                                        }
                
                                    }
                
                                }
                
                            });
                
                        });
                    }
                }
                console.log("cant find crop to plant")
                return false;
            });
        });
    });
    

}

function purchase(farmid, listing, listingId) {
    const price = listing.price;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");
        console.log(farmid, price)
        // Try to find if there is a farm with this id and pass
        var query = { id: farmid };
        dbo.collection("farms").find(query).toArray(function (err, result) {
            if (err) throw err;
            // set the settings to the result
            var m = result[0].money - price;
            console.log(m)
            if (result[0].money > price) {
                var m = result[0].money - price;
                console.log(m)
                dbo.collection("farms").updateOne(query, { $set: { money: m } }, function (err, res) {
                    if (err) throw err;
                    console.log("Money updated: " + res);
                    // emit to the room that a block has been updated
                    server.to(farmid.toString()).emit('updateMoney', m);
                    server.to(farmid.toString()).emit('purchased');
                    db.close();
                    updateMarketplace(farmid, listingId);
                    addCropToInventory(farmid, listing.name);
                    updateMoney(listing.farmId, listing.price)
                    return true
                });
            } else {
                server.to(farmid.toString()).emit('errorMessage', "You don't have enough money to make this purchase");
                return false
            }
        });
    });
}


function updateMoney(farmid, amount) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");
        // Try to find if there is a farm with this id and pass
        var query = { id: farmid };
        dbo.collection("farms").find(query).toArray(function (err, result) {
            if (err) throw err;
            // set the settings to the result
            var m = result[0].money + amount;
            console.log(m)
            dbo.collection("farms").updateOne(query, { $set: { money: m } }, function (err, res) {
                if (err) throw err;
                console.log("Money updated: " + res);
                // emit to the room that a block has been updated
                server.to(farmid.toString()).emit('updateMoney', m);
                server.to(farmid.toString()).emit('itemSold');
                db.close();
            });
        });
    });
}

function sendCropBlock(farmid, query, grid, row, column, cropName) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");
        // update blocks with added crop
        dbo.collection("blocks").updateOne(query, { $set: { blocks: grid } }, function (err, res) {
            if (err) throw err;
            console.log("Block updated: " + res);
            // emit to the room that a block has been updated
            server.to(farmid.toString()).emit('singleCropBlockUpdate', row, column, cropName, grid[row][column].growTime, grid[row][column].startedGrowing);
            db.close();
        });
    });
}

async function retrieveMarketplace(farmId) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");

        // Get all marketplace listings
        dbo.collection("marketplace").find({}).toArray(function (err, result) {
            if (err) throw err;
            // set the settings to the result
            db.close().then(() => {
                server.to(farmId.toString()).emit("marketplaceData", result);
            });
        });
    });
}

async function retrieveInventory(farmId) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");

        // Get all marketplace listings
        dbo.collection("cropInventories").find({ id: farmId }).toArray(function (err, result) {
            if (err) throw err;
            // set the settings to the result
            db.close().then(() => {
                server.to(farmId.toString()).emit("inventoryUpdate", result[0]);
            });
        });
    });
}

async function retrieveShop(farmId) {
    server.to(farmId.toString()).emit("shopData", crops);
}


async function buyFromMarketplace(farmId, listingId) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");
        console.log(listingId)
        // Get all marketplace listings
        dbo.collection("marketplace").find({}).toArray(function (err, result) {
            if (err) throw err;
            // set the settings to the result
            db.close().then(() => {
                for (let i = 0; i < result.length; i++) {
                    console.log(result[i])
                    if (result[i].listingId == listingId) {
                        console.log(result[i])
                        purchase(farmId, result[i], listingId)
                        return;
                    }

                }

            });
        });
    });
}

async function buyFromShop(farmid, itemId) {
    const price = crops[itemId].price;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");
        console.log(farmid, price)
        // Try to find if there is a farm with this id and pass
        var query = { id: farmid };
        dbo.collection("farms").find(query).toArray(function (err, result) {
            if (err) throw err;
            // set the settings to the result
            console.log('current exp', result[0].exp)
            if (crops[itemId].level > calcLevel(result[0].exp)) {
                server.to(farmid.toString()).emit('errorMessage', "You don't have the required level to buy this crop.");
                return false;
            }
            if (result[0].money > price) {
                var m = result[0].money - price;
                console.log(m)
                dbo.collection("farms").updateOne(query, { $set: { money: m } }, function (err, res) {
                    if (err) throw err;
                    console.log("Money updated: " + res);
                    // emit to the room that a block has been updated
                    server.to(farmid.toString()).emit('updateMoney', m);
                    server.to(farmid.toString()).emit('purchased');
                    db.close();
                    addCropToInventory(farmid, crops[itemId].name);
                    return true
                });
            } else {
                server.to(farmid.toString()).emit('errorMessage', "You don't have enough money to make this purchase");
                return false
            }
        });
    });
}

async function updateMarketplace(farmId, listingId) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var dbo = db.db("farm");
        dbo.collection("marketplace").deleteOne({ listingId: listingId }, function (err, res) {
            if (err) throw err;
            console.log("Deleted item from marketplace", listingId);
            retrieveMarketplace(farmId);
            db.close();
        });

    });

}
async function removeCropFromInventory(farmid, cropName) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");

        var query = { id: farmid };
        // Find the blocks data for this farm
        dbo.collection("cropInventories").find(query).toArray(function (err, result) {
            if (err) {
                errCount++;
                throw err;
            } console.log('Crop inv found')
            db.close().then(() => {
                var cropInventory = result[0];
                console.log("Looking for: " + cropName)
                for (let i = 0; i < cropInventory.crops.length; i++) {
                    if (cropInventory.crops[i].name == cropName) {
                        console.log("Amount found: " + cropInventory.crops[i].amount)
                        if (cropInventory.crops[i].amount > 0) {
                            cropInventory.crops[i].amount--;
                            updateCropInventory(farmid, cropName, cropInventory, true);
                        }
                    }
                }
            });

        });
    });

}

async function addCropToInventory(farmid, cropName) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");

        var query = { id: farmid };
        // Find the blocks data for this farm
        dbo.collection("cropInventories").find(query).toArray(function (err, result) {
            if (err) {
                errCount++;
                throw err;
            } console.log('Crop inv found while buying')
            db.close().then(() => {
                var cropInventory = result[0];
                console.log("Looking for: " + cropName)
                for (let i = 0; i < cropInventory.crops.length; i++) {
                    if (cropInventory.crops[i].name == cropName) {
                        console.log("Amount found: " + cropInventory.crops[i].amount)
                        cropInventory.crops[i].amount++;
                        return updateCropInventory(farmid, cropName, cropInventory, false);
                    }
                }
                for (let i = 0; i < crops.length; i++) {
                    if (crops[i].name == cropName) {
                        cropInventory.crops.push(crops[i])
                        return updateCropInventory(farmid, cropName, cropInventory, false);
                    }
                    
                }

            });

        });
    });

}

async function removeOneFromCropInventory(farmid, cropName, cropInventory, list) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");
        // update blocks with added crop
        dbo.collection("cropInventories").updateOne({ id: farmid }, { $set: { crops: cropInventory.crops } }, function (err, res) {
            if (err) throw err;

            db.close().then(() => {
                console.log("Crop inv updated: " + res);
                // emit to the room that a block has been updated
                server.to(farmid.toString()).emit('inventoryUpdate', cropInventory, false);
                if (list) {
                    addCropToMarketplace(cropName, farmid);
                }
            });
        });
    });
}

async function updateCropInventory(farmid, cropName, cropInventory, list) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");
        // update blocks with added crop
        dbo.collection("cropInventories").updateOne({ id: farmid }, { $set: { crops: cropInventory.crops } }, function (err, res) {
            if (err) throw err;

            db.close().then(() => {
                console.log("Crop inv updated: " + res);
                // emit to the room that a block has been updated
                server.to(farmid.toString()).emit('inventoryUpdate', cropInventory, false);
                if (list) {
                    addCropToMarketplace(cropName, farmid);
                }
            });
        });
    });
}

async function addCropToMarketplace(cropName, farmId) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        // Connect to db
        var dbo = db.db("farm");

        for (let i = 0; i < crops.length; i++) {
            if (crops[i].name == cropName) {
                // insert the farm settings
                var date = new Date();
                const obj = {
                    name: cropName,
                    icon: crops[i].icon,
                    level: crops[i].level,
                    price: 2,
                    farmId: farmId,
                    listingId: date.getTime()
                }
                dbo.collection("marketplace").insertOne(obj, function (err, res) {
                    if (err) throw err;
                    console.log(`Added item to marketplace ${cropName}`);
                    db.close();
                });
                return;
            }

        }


    })
}

// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("farm");
//     dbo.collection("farms").deleteMany({}, function(err, obj) {
//       if (err) throw err;
//       console.log(obj.result.n + " document(s) deleted");
//       db.close();
//     });
//   });

function calcLevel(currentExp) {

    // base level 0 exp
    var expCount = 1000;
    // For in the loop
    var prevLevelExp = 0;
    const multiplier = 1.10;
    // 100 levels
    for (let le = 1; le <= 100; le++) {
        expCount *= multiplier;
        // Check if current exp is in between values
        if (currentExp > prevLevelExp && currentExp < expCount) {
            console.log(le)
            return le;
        }
        prevLevelExp = expCount;

    }

}