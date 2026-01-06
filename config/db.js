const { MongoClient, ObjectId } = require("mongodb")

class Database {
    constructor() {
        this.client = null;
        this.db = null;
    }
    //To connect to the database
    async connect() {
        try {
            if (!this.client) {
                this.client = new MongoClient(process.env.MONGODB_URI)
                cosn
                await this.client.connect()
                console.log("MongoDB Connected Successfully")
            }

            //extract the Db name from the connection string
            if (!this.db) {
                this.db = this.client.db();
            }

            //Retutn Db to perform operations on it
            return this.db;



        } catch (error) {
            console.log("MOngoDb Connection Error: ", error.message)
            process.exit(1)
        }
    }

    //To get the database instance
    getDb() {
        if (!this.db) {
            throw new Error("Database not connected")
        }
        return this.db
    }

    //To validate or convert Ids into mongoObject Id
    getObjectId(id) {
        try {
            return new ObjectId(id)
        } catch (error) {
            throw new Error("Invalid Object ID")
        }
    }

    //close the connection
    async close() {
        if (this.client) {
            await this.client.close()
            this.client = null;
            this.db = null;
            console.log("MongoDB Connection Closed")
        }
        //If you don't set this.client = null, this check would still see the old (closed) client
        //The code would think a connection exists when it actually doesn't
        //This leads to errors when trying to use a closed connection   
    }

}

module.exports = new Database();
