// SERVER //

require("dotenv").config();
const express = require('express');
const app = express();
const path = require("path");
const db = require('../database/db.js');

// get first 20 products
app.get('/products', async (req, res) => {
  let products = await db.get20Products();
  res.send(products);
})

// get product by id
app.get('/products/:product_id', async (req, res) => {
  let products = await db.getProductById(req.params.product_id);
  let product = products[0];
  res.send(product);
});

// get style info for a product by id
app.get('/products/:product_id/styles', async (req, res) => {
  let styles = await db.getProductStyles(req.params.product_id);
  // for each style, add the photos and skus for it
  for (style of styles) {
    let photos = await db.getPhotosForStyle(style.id);
    let skus = await db.getSkusForStyle(style.id);
    style.photos = photos;
    style.skus = skus;
  }
  let final = {
    product_id: req.params.product_id,
    results: styles
  }
  res.send(final);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

module.exports = app;