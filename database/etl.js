const fs = require("fs");
const csvParser = require("csv-parser");
const csv = require('fast-csv');
const path = require('path');
const db = require('./db.js');

const productPath = path.join(__dirname, '../assets/product.csv');
const stylesPath = path.join(__dirname, '../assets/styles.csv');
const photosPath = path.join(__dirname, '../assets/photos.csv');
const skusPath = path.join(__dirname, '../assets/skus.csv');


// load and save product to collection
var asyncLoadAndSaveProducts = () => {

  console.log('starting product');

  return new Promise((resolve, reject) => {

    var productRows = [];
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
        if (data.id % 200000 === 0) {
          console.log('200k repeat', data.id);
        }
      })
      .on('end', async () => {
        await db.addProducts(productRows)
        console.log('all product loaded to db');
        resolve();
      })
  });
}

// load and save styles to DB
var asyncLoadAndSaveStyles = () => {

  console.log('starting styles');

  return new Promise((resolve, reject) => {

    var styleRows = [];
    const parser = csv.parse({ headers: true });

    fs.createReadStream(stylesPath)
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', async (data) => {
        styleRows.push(data);
        if (styleRows.length === 10000) {
          parser.pause();
          await db.addStyles(styleRows);
          styleRows = [];
          parser.resume();
        }
        if (data.id % 300000 === 0) {
          console.log('300k repeat', data.id);
        }
      })
      .on('end', async () => {
        await db.addStyles(styleRows);
        console.log('all styles added');
        resolve();
      })
  });
}

// load and save photos to DB
var asyncLoadAndSavePhotos = () => {

  console.log('starting photos');

  return new Promise((resolve, reject) => {

    let photoRows = [];
    const parser = csv.parse({ headers: true });

    fs.createReadStream(photosPath)
      .pipe(csvParser())
      .on('error', error => console.error(error))
      .on('data', async (data) => {
        photoRows.push(data);
        if (photoRows.length === 10000) {
          parser.pause();
          await db.addPhotos(photoRows);
          photoRows = [];
          parser.resume();
        }
        if (data.id % 1000000 === 0) {
          console.log('1mill repeat', data.id);
        }
      })
      .on('end', async () => {
        await db.addPhotos(photoRows);
        console.log('all photos added');
        resolve();
      })
  })
}

// load and save skus to DB
var asyncLoadAndSaveSkus = () => {

  console.log('starting skus');

  return new Promise((resolve, reject) => {

    let skuRows = [];
    const parser = csv.parse({ headers: true });

    fs.createReadStream(skusPath)
      .pipe(csvParser())
      .on('error', error => console.error(error))
      .on('data', async (data) => {
        skuRows.push(data);
        if (skuRows.length === 10000) {
          parser.pause();
          await db.addSkus(skuRows);
          skuRows = [];
          parser.resume();
        }
        if (data.id % 1000000 === 0) {
          console.log('1mill repeat', data.id);
        }
      })
      .on('end', async () => {
        await db.addSkus(skuRows);
        console.log('all skus added');
        resolve();
      })
  })
}

var createAll = async () => {
  console.log('clearning product');
  await db.clearProduct();
  console.log('cleared');
  console.log('clearning style');
  await db.clearStyle();
  console.log('cleared');
  console.log('clearning photo');
  await db.clearPhoto();
  console.log('cleared');
  console.log('clearning sku');
  await db.clearSku();
  console.log('cleared');

  await asyncLoadAndSaveProducts();
  await asyncLoadAndSaveStyles();
  await asyncLoadAndSavePhotos();
  await asyncLoadAndSaveSkus();
  console.log('done all');
}

createAll();