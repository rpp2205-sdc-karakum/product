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
  let product = await db.getProductById(req.params.product_id);
  res.send(product);
});

// get style info for a product by id
app.get('/products/:product_id/styles', async (req, res) => {
  let styles = await db.getProductById(req.params.product_id);
  styles = styles[0].styles;
  res.send(styles);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
