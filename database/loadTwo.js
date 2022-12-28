const fs = require("fs");
const csvParser = require("csv-parser");
const csv = require('fast-csv');
const path = require('path');
const db = require('./db.js');

const productPath = path.join(__dirname, '../assets/product.csv');
const stylesPath = path.join(__dirname, '../assets/styles.csv');
const photosPath = path.join(__dirname, '../assets/photos.csv');
const skusPath = path.join(__dirname, '../assets/skus.csv');


// load and save product to DB
var asyncLoadAndSaveProducts = () => {

  return new Promise((resolve, reject) => {

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

        if (data.id % 200000 === 0) {
          console.log('up to: ', data)
        }
      })
      .on('end', async () => {
        await db.addProducts(productRows)
        console.log('all product saved');
        resolve();
      })
  });
}

// load and save styles to DB
var asyncLoadAndSaveStyles = () => {

  return new Promise((resolve, reject) => {

    const parser = csv.parse({ headers: true });
    let styleRows = []
    let styleRow = {
      product_id: '1',
      results: []
    }
    var firstId, lastId;

    fs.createReadStream(stylesPath)
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', async (data) => {

        let style = {
          style_id: data.id,
          name: data.name,
          original_price: data.original_price,
          sale_price: data.sale_price,
          default: data.default_style === '1' ? true: false,
          photos: [],
          skus: []
        }

        // record first style Id in batch
        if (!styleRows.length) {
          firstId = data.id;
        }

        if (data.productId !== styleRow.product_id) {
          styleRows.push(styleRow)

          // if there are no styles for a product
          let i = 1;
          while (parseInt(data.productId) != parseInt(styleRow.product_id) + i) {
            let emptyRow = {
              product_id: (parseInt(styleRow.product_id) + i).toString(),
              results: []
            }
            styleRows.push(emptyRow)
            i++;
          }

          styleRow = {
            product_id: data.productId,
            results: []
          }
        }

        styleRow.results.push(style);

        // track lastId
        lastId = data.id;

        if (styleRows.length >= 10000) {
          parser.pause();

          // add photos to style rows
          console.log('adding photos');
          styleRows = await addPhotos(styleRows, firstId, lastId);
          console.log('added');

          // add style rows to collection
          await db.addStyles(styleRows);

          // reset rows in memory and continue
          styleRows = [];
          parser.resume();
        }

        if (data.id % 300000 === 0) {
          console.log('up to', data);
        }

      })
      .on('end', async () => {
        await db.addStyles(styleRows);
        console.log('all styles added');
        resolve();
      })
  });
}

// load and match photos to styleRows
// ([], 1, 10000)
var addPhotos = (styleRows, firstId, lastId) => {

  console.log(firstId, lastId)

  return new Promise((resolve, reject) => {

    const parser = csv.parse({ headers: true });
    let photoRows = [];
    let photosGroup = [];
    let styleGroupId = firstId;

    var photoStream = fs.createReadStream(photosPath);
    photoStream
      .pipe(csvParser())
      .on('error', error => console.error(error))
      .on('data', async (data) => {

        // exit once passed the last style (all styles in range have photos added)
        if (data.styleId > lastId) {
          photoStream.destroy();
          resolve(styleRows);
        }

        // current photo is within style range
        if (data.styleId >= firstId && data.styleId <= lastId) {

          // previous photo group is done
          if (data.styleId != styleGroupId) {

            // update style with photosGroup
            let updated = false;
            let i = j = 0;
            while(!updated && i < styleRows.length) {
              while (!updated && j < styleRow.results.length) {
                if (styleRows[i].results[j].style_id == styleGroupId) {
                  styleRows[i].results[j].photos = photosGroup;
                  updated = true;
                }
              }
            }
            // reset the photosGroup and set groupId
            photosGroup = [];
            groupStyleId = data.styleId;
          }

          // make the photo object
          let photo = {
            id: data.id,
            thumbnail_url: data.thumbnail_url,
            url: data.url
          }
          // add to the photos array
          photosGroup.push(photo);
        }

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

  console.log('clearning product');
  await db.clearProduct();
  console.log('cleared');

  let prod = await db.getProductById('1');
  console.log('find one', prod);

  console.log('loading and saving product table')
  await asyncLoadAndSaveProducts();
  console.log('finsihed product');

  prod = await db.getProductById('1');
  console.log('find one', prod);
};

var createStyles = async () => {

  console.log('clearning style');
  await db.clearStyle();
  console.log('cleared');

  console.log('adding styles')
  await asyncLoadAndSaveStyles();
  console.log('styles added')

}

// createProducts()

createStyles()

var readPhotos = () => {

  console.log('starting');

  const parser = csv.parse({ headers: true });

  var stream = fs.createReadStream(photosPath)
  stream
    .pipe(csvParser())
    .on('error', error => console.error(error))
    .on('data', async (data) => {
      if (data.id == '4000000') {
        console.log('here');
        stream.destroy()
        console.log('okaaa');
      }
    })

}

// addPhotos()