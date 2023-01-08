const mongoose = require('mongoose');

// Photo Schema
const photoSchema = new mongoose.Schema({
  id:             String,
  styleId:        { type: String, index: true },
  url:            String,
  thumbnail_url:  String
}, { collection: 'photo' });

// make an instance of schema
const Photo = mongoose.model('Photo', photoSchema);

// export collection
module.exports.Photo = Photo;