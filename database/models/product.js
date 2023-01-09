const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  id:             { type: String, index: true },
  name:           String,
  category:       String,
  slogan:         String,
  description:    String,
  default_price:  String
}, { collection: 'product' });

// make an instance of schema
const Product = mongoose.model('Product', productSchema);

// export collection
module.exports.Product = Product;