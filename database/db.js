// DataBase using mongoose schema //

require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/product');

// Schema
const productSchema = new mongoose.Schema({
  id: { type: String, index: true },
  name: String,
  category: String,
  slogan: String,
  description: String,
  default_price: String,
  styles: {
    product_id: String,
    results: [
      {
        style_id: String,
        name: String,
        original_price: String,
        sale_price: String,
        default: Boolean,
        photos: [
          {
            id: String,
            url: String,
            thumbnail_url: String
          }
        ],
        skus: [
          {
            id: String,
            size: String,
            quantity: String
          }
        ]
      }
    ]
  }
}, { collection: 'product' });

// index
// productSchema.index({ id: 1 });

// make an instance of schema and export
const Product = mongoose.model('Product', productSchema);

// index for immediate search for product by Id
// Product.index({ id: 1 });

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
  }

}

module.exports.Product = Product;