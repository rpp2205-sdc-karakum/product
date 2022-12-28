// DataBase using mongoose schema //

require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/product');

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: String, index: true },
  name: String,
  category: String,
  slogan: String,
  description: String,
  default_price: String
}, { collection: 'product' });

// Style Schema
const styleSchema = new mongoose.Schema({
  id: { type: String, index: true },
  productId: { type: String, index: true },
  name: String,
  sale_price: String,
  default_style: Number
}, { collection: 'style' });

// Photo Schema
const photoSchema = new mongoose.Schema({
  id: String,
  styleId: { type: String, index: true },
  url: String,
  thumbnail_url: String
}, { collection: 'photo' });

// Sku Schema
const skuSchema = new mongoose.Schema({
  id: String,
  styleId: { type: String, index: true },
  size: String,
  quantity: String
}, { collection: 'sku' });



// make an instance of schema and export
const Product = mongoose.model('Product', productSchema);
// make an instance of schema and export
const Style = mongoose.model('Style', styleSchema);
// make an instance of schema and export
const Photo = mongoose.model('Photo', photoSchema);
// make an instance of schema and export
const Sku = mongoose.model('Sku', skuSchema);


// Interaction and exports

module.exports = {

  clearProduct: () => {
    return Product.deleteMany();
  },

  clearStyle: () => {
    return Style.deleteMany();
  },

  clearPhoto: () => {
    return Photo.deleteMany();
  },

  clearSku: () => {
    return Sku.deleteMany();
  },

  addProduct: (oneProduct) => {
    var product = new Product( oneProduct )
    return product.save();
  },

  addStyle: (oneStyle) => {
    var style = new Style( oneStyle )
    return style.save();
  },

  addProducts: (productsArray) => {
    return Product.insertMany( productsArray );
  },

  addStyles: (stylesArray) => {
    return Style.insertMany( stylesArray );
  },

  addPhotos: (photosArray) => {
    return Photo.insertMany( photosArray );
  },

  addSkus: (skusArray) => {
    return Sku.insertMany( skusArray );
  },

  getProductById: (id) => {
    return Product.find( {id} );
  },

  get20Products: (id) => {
    return Product.find( {} ).limit( 20 );
  },

  getProductStyles: (productId) => {
    return Style.find( { productId });
  },

  getPhotosForStyle: (styleId) => {
    return Photo.find( { styleId });
  },

  getSkusForStyle: (styleId) => {
    return Sku.find( { styleId });
  }

}

module.exports.Product = Product;
module.exports.Style = Style;
module.exports.Photo = Photo;
module.exports.Sku = Sku;