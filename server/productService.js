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
  let product = products[0]
  res.send(product);
});

// get style info for a product by id
app.get('/products/:product_id/styles', async (req, res) => {
  let products = await db.getProductById(req.params.product_id);
  styles = products[0].styles;
  let result = {
    product_id: req.params.product_id,
    results: styles
  }
  res.send(result);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
