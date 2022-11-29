// DataBase using mongoose schema //

require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/product');

// Schema
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  slogan: String,
  description: String,
  default_price: String,
  styles: [{
    id: String,
    name: String,
    sale_price: String,
    default: String,
    photos: [{
      id: String,
      url: String,
      thumbnail_url: String
    }],
    skus: [{
      id: String,
      size: String,
      quantity: String
    }]
  }]
}, { collection: 'product' });

// make an instance of schema and export
const Product = mongoose.model('Product', productSchema);

// Interaction and exports

module.exports = {

  clearDB: () => {
    return Product.deleteMany();
  },

  addProduct: (oneProduct) => {
    const product = new Product( oneProduct )
    return product.save();
  },

  addProducts: (productsArray) => {
    return Product.insertMany( productsArray );
  },

  getProductById: (id) => {
    return Product.find( {id} );
  },

  get20Products: (id) => {
    return Product.find( {} ).limit( 20 );
  },


}

module.exports.Product = Product;