//a6_monthSales.js
import connect from "./connect.js";

//For each supplier, determine the total number of goods sold in December 2006.
async function countDecemberSales() {
  const db = await connect();
  
  try {
    const suppliers = await db.collection("Suppliers").find().toArray();
    const supplierMap = new Map(suppliers.map(s =>[s._id.toString(),s.name]));

    const sales = await db.collection("Sales").aggregate([
      {
        $match: {
          date: {
            $gte: new Date("2006-12-01"),
            $lte: new Date("2006-12-31")
          }
        }
      },
      {
         $unwind: "$productsSold"
      },
      {
        $group: {
          _id: "$productsSold.supplierId",
          totalSold: { $sum: "$productsSold.quantity" }
        }
      }
    ]).toArray();

    console.table(sales.map(s => ({
      "Supplier Name": supplierMap.get(s._id.toString()) || "Unknown",
      "Total Number of Sold": s.totalSold
    })));

  } finally {
    await db.client.close();
  }
}

countDecemberSales();

