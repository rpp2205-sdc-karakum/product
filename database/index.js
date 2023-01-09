// DataBase using mongoose schema //
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION_ROUTE);

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

module.exports = db;