//connect.js
import { MongoClient } from "mongodb";

const uri = "mongodb://dev:dev@127.0.0.1:27017/WangShanniCmpWrld";
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
    return client.db("WangShanniCmpWrld");
  } catch (err) {
    console.error("Execution error:", err);
    process.exit(1);
  }
}

export default connect;
