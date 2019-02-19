var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
// This is made to create the database and collections for a fresh start
clearCollections();

function createDatabase() {

    MongoClient.connect(url + "farm", function (err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
    });
}
function clearCollections() {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");

        dbo.collection("farms").deleteMany({}, function (err, obj) {
            if (err) throw err;
            db.close();
        });

        dbo.collection("blocks").deleteMany({}, function (err, obj) {
            if (err) throw err;
            db.close();
        });
        dbo.collection("cropInventories").deleteMany({}, function (err, obj) {
            if (err) throw err;
            db.close();
        });
        dbo.collection("itemInventories").deleteMany({}, function (err, obj) {
            if (err) throw err;
            db.close();
        });
        dbo.collection("marketplace").deleteMany({}, function (err, obj) {
            if (err) throw err;
            db.close();
            createCollections();
        });
    });
}
function createCollections() {

    MongoClient.connect(url + "farm", function (err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
    });

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("farm");

        dbo.createCollection("farms", function (err, res) {
            if (err) throw err;
            console.log("Farms Collection created!");
            db.close();
        });

        dbo.createCollection("blocks", function (err, res) {
            if (err) throw err;
            console.log("Blocks Collection created!");
            db.close();
        });

        dbo.createCollection("cropInventories", function (err, res) {
            if (err) throw err;
            console.log("cropInventories Collection created!");
            db.close();
        });

        dbo.createCollection("itemInventories", function (err, res) {
            if (err) throw err;
            console.log("itemInventories Collection created!");
            db.close();
        });

        dbo.createCollection("marketplace", function (err, res) {
            if (err) throw err;
            console.log("marketplace Collection created!");
            db.close();
        });


    });
}