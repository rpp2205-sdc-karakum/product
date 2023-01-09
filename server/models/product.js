const Product = require('../../database/models/product.js').Product;
const db = require('../../database/index.js');

module.exports = {

  clearProduct: () => {
    return Product.deleteMany( {} );
  },

  addProduct: (oneProduct) => {
    var product = new Product( oneProduct )
    return product.save();
  },

  addProducts: (productsArray) => {
    return Product.insertMany( productsArray );
  },

  get20Products: () => {
    return Product.find( {} ).limit( 20 );
  },

  getProductById: (id) => {
    return Product.find( {id} );
  }

}