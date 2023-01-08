require("dotenv").config();

// express server
const express = require('express');
const app = express();

const product = require('./controllers/product.js');
const style = require('./controllers/style.js');

// Routes

app.get('/products', (req, res) => {
  product.get20Products(req, res);
});

app.get('/products/:product_id', (req, res) => {
  product.getProductById(req, res)
});

app.get('/products/:product_id/styles', (req, res) => {
  style.getProductStyles(req, res);
});

// listen at port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

module.exports = app;