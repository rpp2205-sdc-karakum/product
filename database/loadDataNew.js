const fs = require("fs");
const csvParser = require("csv-parser");
const csv = require('fast-csv');
const path = require('path');
const db = require('./db.js');

const productPath = path.join(__dirname, '../assets/product.csv');
const stylesPath = path.join(__dirname, '../assets/styles.csv');


// load and save all products and metadata to collection
var asyncLoadAndSaveProduct = () => {

  return new Promise((resolve, reject) => {

    let productRows = [];
    const parser = csv.parse({ headers: true });

    fs.createReadStream(productPath)
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', async (data) => {
        data.styles = {
          product_id: data.id,
          results: []
        };
        productRows.push(data);
        if (productRows.length === 10000) {
          parser.pause();
          productRows = await addStyles(productRows);
          await db.addProducts(productRows);
          console.log('up to:', productRows[productRows.length-1]);
          productRows = [];
          parser.resume();
        }
      })
      .on('end', async () => {
        productRows = await addStyles(productRows);
        // productRows = await addPhotos(productRows);
        // productRows = await addSkus(productRows);
        await db.addProducts(productRows)
        console.log('all product loaded to db');
        resolve();
      })
  });
}

// add styles to input products
var addStyles = (productRows) => {

  return new Promise((resolve, reject) => {

    const parser = csv.parse({ headers: true });
    let productStyles = [];
    let groupProductId = '1';

    var readStream = fs.createReadStream(stylesPath);
    readStream
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', (data) => {

        if (data.productId >= productRows[0].id && data.productId <= productRows[productRows.length - 1].id + 1) {

          let currentProductId = data.productId;

          if (currentProductId !== groupProductId) {
            for (var pEntry of productRows) {
              if (pEntry.id === groupProductId) {
                pEntry.styles.results = productStyles;
                break;
              }
            }
            productStyles = [];
            groupProductId = currentProductId;
            if (groupProductId == productRows[productRows.length - 1].id + 1) {
              readStream.destroy();
              resolve(productRows);
            }
          }

          let style = {
            style_id: data.id,
            name: data.name,
            original_price: data.original_price,
            sale_price: data.sale_price,
            default: data.default_style === '1' ? true: false,
            photos: [],
            skus: []
          }
          productStyles.push(style);
        }

      })
      .on('end', () => {
        console.log('all styles added');
        resolve(productRows);
      })
  });
}

// add photos to input products
var asyncLoadAndSavePhotos = () => {

  return new Promise((resolve, reject) => {

    const photosPath = path.join(__dirname, '../assets/photos.csv');
    const parser = csv.parse({ headers: true });
    let style_photos = [];
    let groupStyleId = '1';

    fs.createReadStream(photosPath)
      .pipe(csvParser())
      .on('error', error => console.error(error))
      .on('data', async (data) => {

        let currentStyleId = data.styleId;

        if (currentStyleId !== groupStyleId) {
          parser.pause();
          let docs = await db.getProductByStyleId(groupStyleId);
          let doc = docs[0];
          doc.styles.results.forEach(s => s.style_id == groupStyleId? s.photos = style_photos: null)
          await doc.save()
          style_photos = [];
          groupStyleId = currentStyleId;
          parser.resume();
        }

        let photo = {
          id: data.id,
          thumbnail_url: data.thumbnail_url,
          url: data.url
        }
        style_photos.push(photo);

        if (data.id % 100000 === 0) {
          console.log('100k repeat', data.id);
        }

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


var createProducts = async () => {

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

// createProducts();

// var addStyles = async () => {

//   console.log('adding styles')
//   await asyncLoadAndSaveStyles();
//   console.log('styles added')
//   prod = await db.getProductById('1');
//   console.log('find one', prod);

// }

// addStyles();

// var addPhotos = async () => {

//   console.log('adding photos')
//   await asyncLoadAndSavePhotos();
//   console.log('photos added')
//   prod = await db.getProductById('1');
//   console.log('find one', prod[0].styles);

// }

// addPhotos();

var createDB = async () => {
  await createProducts()
  await addStyles()
  // await asyncLoadAndSavePhotos()
}

createDB();



// var addPhotos = async () => {

//   console.log('adding styles')
//   await asyncLoadAndSaveStyles();
//   console.log('styles added')
//   prod = await db.getProductById('1');
//   console.log('find one', prod);

// }

var findbyStyle = async () => {
  let docs = await db.getProductByStyleId('37');
  let doc = docs[0]
  doc.styles.results.forEach(s => s.style_id == '37'? s.photos = [ { id: '2', thumbnail_url: 'string', url: 'string' } ]: null)
  console.log(doc.styles.results[0]);
}

// findbyStyle();


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
// var clear = async () => {
//   console.log('clearing');
//   console.log('find result:', db.get20Products());
//   await db.clearDB();
//   console.log('find result:', db.get20Products());
//   console.log('cleared');
// }
// clear();