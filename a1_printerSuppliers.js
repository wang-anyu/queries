//a1_printerSuppliers.js
import connect from "./connect.js";

//Obtain the names and phone numbers of the vendors 
// that supplied the printers during the summer of 2006.
async function getPrinterSuppliers() {
  const db = await connect();
  
  try {
    const products = await db.collection("Products").find({
      name: "Printer",
      "suppliers.date": {
        $gte: new Date("2006-06-01"),
        $lte: new Date("2006-08-31")
      }
    }).toArray();

    const supplierIds = products.flatMap(p => 
      p.suppliers
        .filter(s => s.date >= new Date("2006-06-01") && s.date <= new Date("2006-08-31"))
        .map(s => s.supplierId)
    );

    const suppliers = await db.collection("Suppliers").find({
      _id: { $in: supplierIds }
    }, {
      projection: { name: 1, phoneNumber: 1 }
    }).toArray();

    console.table(suppliers.map(s => ({
      "Suppliers Name": s.name,
      "Phone Number": s.phoneNumber
    })));

  } finally {
    await db.client.close();
  }
}

getPrinterSuppliers();

