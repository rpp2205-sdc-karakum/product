const fs = require("fs");
const csvParser = require("csv-parser");
const csv = require('fast-csv');
const path = require('path');
const db = require('./db.js');

const productPath = path.join(__dirname, '../assets/product.csv');
const stylesPath = path.join(__dirname, '../assets/styles.csv');
const photosPath = path.join(__dirname, '../assets/photos.csv');
const skusPath = path.join(__dirname, '../assets/skus.csv');

const productParser = csv.parse({ headers: true });
const stylesParser = csv.parse({ headers: true });
const photosParser = csv.parse({ headers: true });
const skusParser = csv.parse({ headers: true });


var resumeParser = (parser) => {
  parser.resume();
}

// var populateCollection = async () => {
//   await asyncLoadAndSaveProduct
// }

// load and save product to DB
var asyncLoadAndSaveProduct = () => {

  return new Promise((resolve, reject) => {

    let productRows = [];
    let batch = 1;

    fs.createReadStream(productPath)
      .pipe(productParser)
      .on('error', error => console.error(error))
      .on('data', async (productRowData) => {
        productRowData.styles = {
          product_id: productRowData.id,
          results: []
        };
        productRows.push(productRowData);

        if (productRows.length === 10000) {

          productParser.pause();

          await addStylesToRows(productRows, batch);

          await db.addProducts(productRows)

          productRows = [];

          productParser.resume();
        }
      })
      .on('end', async () => {
        await db.addProducts(productRows)
        console.log('everything loaded to collection');
        resolve();
      })
  });
}

//
var addStyles = async (productRows, batch) => {

  return new Promise((resolve, reject) => {

    const stylesPath = path.join(__dirname, '../assets/styles.csv');
    let productStyles = [];
    const parser = csv.parse({ headers: true });

    fs.createReadStream(stylesPath)
    .pipe(parser)
    .on('error', error => console.error(error))
    .on('data', async (data) => {

      var resumeStylesParse = () => {
        parser.resume()
      }

      if (data.productId > 10000 * batch) {
        parser.pause()
      }

    })
    .on('end', async () => {
      await db.addProducts(productRows)
      console.log('all product loaded to db');
      resolve();
    })

  })

}


var addSkus = async (productRows, batch) => {

  return new Promise((resolve, reject) => {

    const skusPath = path.join(__dirname, '../assets/skus.csv');
    let productStyles = [];
    const parser = csv.parse({ headers: true });

    fs.createReadStream(skusPath)
    .pipe(parser)
    .on('error', error => console.error(error))
    .on('data', async (data) => {

      var resumeStylesParse = () => {
        parser.resume()
      }

      if (data.productId > 10000 * batch) {
        parser.pause()
      }

      addBatch(productRows)

    })
    .on('end', async () => {
      await db.addProducts(productRows)
      console.log('all product loaded to db');
      resolve();
    })

  })

var addBatch = (prodRows) => {
  await addrows
  resumeProductParse();
}

}