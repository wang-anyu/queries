//m2_delDoc.js
import connect from "./connect.js";
import { ObjectId } from "mongodb";

async function processSale() {
  const db = await connect();
  try {
    const productId = "64af124220630af2d4db9ccd";
    const quantity = 10;

    const updateResult = await db.collection("Products").findOneAndUpdate(
      {
        _id: new ObjectId(productId),
        stock: { $gte: quantity }
      },
      { $inc: { stock: -quantity } },
      {
        returnDocument: "after",
        projection: { stock: 1 } 
      }
    );


    if (!updateResult.value) {
      console.log("❌ Out of stock or product does not exist");
      return;
    }

    const saleRecord = {
      date: new Date(),
      productsSold: [{
        productId: new ObjectId(productId),
        quantity: quantity,
        price: 1000
      }]
    };
    await db.collection("Sales").insertOne(saleRecord);

    console.log("✅ Sales successful, remaining stock:", updateResult.value.stock);

  } catch (err) {
    console.error("Execution failed:", err.message);
  } finally {
    await db.client.close();
  }
}

processSale();