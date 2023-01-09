const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// connect to db
require('./index.js').db;

const Product = require('../server/models/product.js');
const Style = require('../server/models/style.js');
const Photo = require('../server/models/photo.js');
const Sku = require('../server/models/sku.js');

const productPath = path.join(__dirname, '../assets/product.csv');
const stylesPath = path.join(__dirname, '../assets/styles.csv');
const photosPath = path.join(__dirname, '../assets/photos.csv');
const skusPath = path.join(__dirname, '../assets/skus.csv');


// load and save product to collection
var asyncLoadAndSaveProducts = () => {

  console.log('starting product');

  return new Promise((resolve, reject) => {

    var productRows = [];
    const parser = csv();

    fs.createReadStream(productPath)
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', async (data) => {
        productRows.push(data);
        if (productRows.length === 10000) {
          parser.pause();
          await Product.addProducts(productRows)
          productRows = [];
          parser.resume();
        }
        if (data.id % 200000 === 0) {
          console.log('200k repeat', data.id);
        }
      })
      .on('end', async () => {
        await Product.addProducts(productRows)
        console.log('all product loaded to db');
        resolve();
      })
  });
}

// load and save styles to collection
var asyncLoadAndSaveStyles = () => {

  console.log('starting styles');

  return new Promise((resolve, reject) => {

    var styleRows = [];
    const parser = csv();

    fs.createReadStream(stylesPath)
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', async (data) => {
        data.photos = [];
        data.skus = [];
        styleRows.push(data);
        if (styleRows.length === 10000) {
          parser.pause();
          await Style.addStyles(styleRows);
          styleRows = [];
          parser.resume();
        }
        if (data.id % 300000 === 0) {
          console.log('300k repeat', data.id);
        }
      })
      .on('end', async () => {
        await Style.addStyles(styleRows);
        console.log('all styles added');
        resolve();
      })
  });
}

// load and save photos to collection
var asyncLoadAndSavePhotos = () => {

  console.log('starting photos');

  return new Promise((resolve, reject) => {

    let photoRows = [];
    const parser = csv();

    fs.createReadStream(photosPath)
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', async (data) => {
        photoRows.push(data);
        if (photoRows.length === 10000) {
          parser.pause();
          await Photo.addPhotos(photoRows);
          photoRows = [];
          parser.resume();
        }
        if (data.id % 1000000 === 0) {
          console.log('1mill repeat', data.id);
        }
      })
      .on('end', async () => {
        await Photo.addPhotos(photoRows);
        console.log('all photos added');
        resolve();
      })
  })
}

// load and save skus to collection
var asyncLoadAndSaveSkus = () => {

  console.log('starting skus');

  return new Promise((resolve, reject) => {

    let skuRows = [];
    const parser = csv();

    fs.createReadStream(skusPath)
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', async (data) => {
        skuRows.push(data);
        if (skuRows.length === 10000) {
          parser.pause();
          await Sku.addSkus(skuRows);
          skuRows = [];
          parser.resume();
        }
        if (data.id % 1000000 === 0) {
          console.log('1mill repeat', data.id);
        }
      })
      .on('end', async () => {
        await Sku.addSkus(skuRows);
        console.log('all skus added');
        resolve();
      })
  })
}

var createAll = async () => {

  console.log('clearing product');
  await Product.clearProduct();
  console.log('cleared product');
  console.log('clearing style');
  await Style.clearStyle();
  console.log('cleared style');
  console.log('clearing photo');
  await Photo.clearPhoto();
  console.log('cleared photos');
  console.log('clearing sku');
  await Sku.clearSku();
  console.log('cleared sku');

  await asyncLoadAndSaveProducts();
  await asyncLoadAndSaveStyles();
  await asyncLoadAndSavePhotos();
  await asyncLoadAndSaveSkus();

  console.log('database loaded');
  process.exit(0);
}

createAll();
