
require('dotenv').config()
var MongoClient = require('mongodb').MongoClient;
var url = process.env.CONNECTION_STRING;

class DatabaseConnection {
    static database;

    static dbConnection() {

        return new Promise((resolve, reject) => {

            if (!DatabaseConnection.database) {
                MongoClient.connect(url, function (err, db) {
                    if (err) reject(err);
                    console.log("Database created!");
                    DatabaseConnection.database = db.db(process.env.DATABASE_NAME);
                    resolve(db.db("mydb"));
                });
            } else {
                resolve(DatabaseConnection.database);
            }
        });
    }

    static get() {
        return this.database;
    }
}

DatabaseConnection.dbConnection();

class NoSQLDatabase {

    constructor(collection) {

        this.collection = collection;
    }

    async insert(document) {
        return await DatabaseConnection.get()
            .collection(this.collection)
            .insertOne(document);
    }

    async find(query) {
        return await DatabaseConnection.get()
            .collection(this.collection)
            .find(query);
    }


}

module.exports.NoSQLDatabase = NoSQLDatabase;