//a7_maxPriceSupplier.js
import connect from "./connect.js";

//Obtain information about the supplier (name, phone number) 
// who delivered the goods in January 2007 at the highest price.
async function findMaxPriceSupplier() {
  const db = await connect();
  
  try {
    const maxRecord = await db.collection("Products").aggregate([
      { $unwind: "$suppliers" },
      { 
        $match: { 
          "suppliers.date": {
            $gte: new Date("2007-01-01"),
            $lte: new Date("2007-01-31")
          }
        } 
      },
      { $sort: { "suppliers.price": -1 } },
      { $limit: 1 }
    ]).toArray();

    if (maxRecord.length > 0) {
      const supplier = await db.collection("Suppliers").findOne({
        _id: maxRecord[0].suppliers.supplierId
      });

      console.table([{
        "Supplier Name": supplier.name,
        "PhoneNumber": supplier.phoneNumber,
        "Price": maxRecord[0].suppliers.price
      }]);
    } else {
      console.log("Unknown");
    }

  } finally {
    await db.client.close();
  }
}

findMaxPriceSupplier();

