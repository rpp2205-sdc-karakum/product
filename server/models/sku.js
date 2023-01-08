const Sku = require('../../database/models/sku.js').Sku;

module.exports = {

  clearSku: () => {
    return Sku.deleteMany( {} );
  },

  addSkus: (skusArray) => {
    return Sku.insertMany( skusArray );
  },

  getSkusForStyle: (styleId) => {
    return Sku.find( { styleId } );
  }

}