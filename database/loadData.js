const fs = require("fs");
const csvParser = require("csv-parser");
const db = require('./db.js');

var asyncReadProduct = () => {
  var productDb = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream("../assets/product.csv")
      .pipe(csvParser())
      .on("data", (data) => {
        data.styles = {};
        productDb[data.id] = data;
      })
      .on("end", () => {
        console.log('parse product complete');
        resolve(productDb);
      })
  })
}

var asyncReadStyles = (productDb) => {
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

var asyncReadPhotos = (productDb, styleIdToProductId) => {
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

var asyncReadSkus = (productDb, styleIdToProductId) => {
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


var loadAndTransformData = () => {

  return new Promise( async (resolve, reject) => {

    await db.clearDB();

    // load data to memory (~3 min)
    var productDb = await asyncReadProduct();
    var [productDb, styleIdToProductId] = await asyncReadStyles(productDb);
    productDb = await asyncReadPhotos(productDb, styleIdToProductId);
    productDb = await asyncReadSkus(productDb, styleIdToProductId);

    // save each entry to DB (~45 min)
    var db = [];
    for (pId in productDb) {
      var styles = [];
      for (sId in productDb[pId].styles) {
        styles.push(productDb[pId].styles[sId]);
      }
      productDb[pId].styles = styles;
      await db.addProduct(productDb[pId]);
    }

    // complete
    console.log('MADE IT');
    resolve(db);
  })
};

// loadAndTransformData();