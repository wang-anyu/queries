//a8_monthOrders.js
import connect from "./connect.js";

//Get statistics on the number of orders in March, April, May 2006 in the form.
async function getSpringOrders() {
  const db = await connect();
  
  try {
    const result = await db.collection("Sales").aggregate([
      {
        $match: {
          date: {
            $gte: new Date("2006-03-01"),
            $lte: new Date("2006-05-31")
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    const monthNames = ["March", "April", "May"];
    console.table(result.map(r => ({
      "Month": monthNames[r._id - 3],
      "Order Number": r.count
    })));

  } finally {
    await db.client.close();
  }
}

getSpringOrders();

