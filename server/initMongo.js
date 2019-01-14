var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

createDatabase();
createCollections();

function createDatabase () {
    MongoClient.connect(url + "farm", function(err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
      });
}

function createCollections () {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("farm");
        dbo.createCollection("farms", function(err, res) {
          if (err) throw err;
          console.log("Farms Collection created!");
          db.close();
        });

        dbo.createCollection("blocks", function(err, res) {
            if (err) throw err;
            console.log("Blocks Collection created!");
            db.close();
          });

      });
}