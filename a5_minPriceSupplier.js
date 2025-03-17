//a5_minPriceSupplier
import connect from "./connect.js";

//For each type of product, determine the supplier that supplies it at the lowest price.
async function findMinPriceSuppliers() {
  const db = await connect();
  
  try {
    const products = await db.collection("Products").find().toArray();
    const suppliers = await db.collection("Suppliers").find().toArray();
    const supplierMap = new Map(suppliers.map(s =>[s._id.toString(),s.name]));

    const results = products.map(p => {
      const minPriceSupplier = p.suppliers.reduce((min, curr) => 
        curr.price < min.price ? curr : min
      );
      
      return {
        "Product ID":  p.id,
        "Product Name": p.name,
        "Lowest Price": minPriceSupplier.price,
        "Supplier Name": supplierMap.get(minPriceSupplier.supplierId.toString()) || "Unknown"
      };
    });

    console.table(results);

  } finally {
    await db.client.close();
  }
}

findMinPriceSuppliers();

