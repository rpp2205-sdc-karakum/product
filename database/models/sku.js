const mongoose = require('mongoose');

// Sku Schema
const skuSchema = new mongoose.Schema({
  id:       String,
  styleId:  { type: String, index: true },
  size:     String,
  quantity: String
}, { collection: 'sku' });

// make an instance of schema
const Sku = mongoose.model('Sku', skuSchema);

// export collection
module.exports.Sku = Sku;