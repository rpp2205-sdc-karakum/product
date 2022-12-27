const fs = require("fs");
const csvParser = require("csv-parser");
const csv = require('fast-csv');
const path = require('path');
const db = require('./db.js');

var asyncLoadAndSaveProduct = () => {

  return new Promise((resolve, reject) => {

    const productPath = path.join(__dirname, '../assets/product.csv');
    let productRows = [];
    const parser = csv.parse({ headers: true });

    fs.createReadStream(productPath)
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', async (data) => {
        productRows.push(data);
        if (productRows.length === 10000) {
          parser.pause();
          await db.addProducts(productRows)
          productRows = [];
          parser.resume();
        }
      })
      .on('end', async () => {
        await db.addProducts(productRows)
        console.log('all product loaded to db');
        resolve();
      })
  })
}

  // return new Promise((resolve, reject) => {
  //   fs.createReadStream("../assets/product.csv")
  //     .pipe(csvParser())
  //     .on("data", (data) => {
  //       data.styles = {};
  //       productDb[data.id] = data;
  //     })
  //     .on("end", () => {
  //       console.log('parse product complete');
  //       resolve(productDb);
  //     })
  // })

var asyncLoadAndSaveStyles = (productDb) => {
  var styleIdToProductId = {};
  return new Promise((resolve, reject) => {
    fs.createReadStream("../assets/styles.csv")
      .pipe(csvParser())
      .on("data", (data) => {
        productDb[data.productId].styles[data.id] = {
          id:         data.id,
          name:       data.name,
          sale_price: data.sale_price,
          default:    data.default_style,
          photos: [],
          skus: []
        };
        styleIdToProductId[data.id] = data.productId;
      })
      .on("end", () => {
        console.log('parse styles complete');
        resolve([productDb, styleIdToProductId]);
      })
  })
}

var asyncLoadAndSavePhotos = (productDb, styleIdToProductId) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("../assets/photos.csv")
      .pipe(csvParser())
      .on("data", (data) => {
        var prodId = styleIdToProductId[data.styleId];
        productDb[prodId].styles[data.styleId].photos.push({
          id: data.id,
          url: data.url,
          thumbnail_url: data.thumbnail_url
        });
      })
      .on("end", () => {
        console.log('parse photos complete');
        resolve(productDb);
      })
  })
}

var asyncLoadAndSaveSkus = (productDb, styleIdToProductId) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("../assets/skus.csv")
      .pipe(csvParser())
      .on("data", (data) => {
          var prodId = styleIdToProductId[data.styleId];
          productDb[prodId].styles[data.styleId].skus.push({
            id: data.id,
            size: data.size,
            quantity: data.quantity
          });
      })
      .on("end", () => {
        console.log('parse skus complete');
        resolve(productDb);
      })
  })
}


var populateDB = async () => {

  console.log('clearning db');
  await db.clearDB();
  console.log('cleared');

  let prod = await db.getProductById('1');
  console.log('find one', prod);

  console.log('loading and saving product table')
  await asyncLoadAndSaveProduct();
  console.log('finsihed product');
  prod = await db.getProductById('1');
  console.log('find one', prod);

};

populateDB();

// var [productDb, styleIdToProductId] = await asyncReadStyles(productDb);
// productDb = await asyncReadPhotos(productDb, styleIdToProductId);
// productDb = await asyncReadSkus(productDb, styleIdToProductId);

// // save each entry to DB (~45 min)
// var db = [];
// for (pId in productDb) {
//   var styles = [];
//   for (sId in productDb[pId].styles) {
//     styles.push(productDb[pId].styles[sId]);
//   }
//   productDb[pId].styles = styles;
//   await db.addProduct(productDb[pId]);
// }

// // complete
// console.log('MADE IT');
// resolve(db);

// clearDB
var clear = async () => {
  console.log('clearing');
  console.log('find result:', db.get20Products());
  await db.clearDB();
  console.log('find result:', db.get20Products());
  console.log('cleared');
}
// clear();