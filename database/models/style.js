const mongoose = require('mongoose');

// Style Schema
const styleSchema = new mongoose.Schema({
  id:             { type: String, index: true },
  productId:      { type: String, index: true },
  name:           String,
  sale_price:     String,
  default_style:  Number,
  photos:         [
    {
      id:             String,
      styleId:        { type: String, index: true },
      url:            String,
      thumbnail_url:  String
    }
  ],
  skus: [
    {
      id:         String,
      styleId:    { type: String, index: true },
      size:       String,
      quantity:   String
    }
  ]
}, { collection: 'style' });

// make an instance of schema
const Style = mongoose.model('Style', styleSchema);

// export collection
module.exports.Style = Style;