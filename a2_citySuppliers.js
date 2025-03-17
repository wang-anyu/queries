//a2_citySuppliers.js
import connect from "./connect.js";

//Obtain information about the number of suppliers located in each city.
async function countSuppliersByCity() {
  const db = await connect();
  
  try {
    const result = await db.collection("Suppliers").aggregate([
      { 
        $group: { 
          _id: "$address.city", 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    console.table(result.map(item => ({
      "City": item._id || "Unkonw",
      "Suppliers Number": item.count
    })));

  } finally {
    await db.client.close();
  }
}

countSuppliersByCity();

