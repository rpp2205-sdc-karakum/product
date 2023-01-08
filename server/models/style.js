const Style = require('../../database/models/style.js').Style;

module.exports = {

  clearStyle: () => {
    return Style.deleteMany();
  },

  addStyle: (oneStyle) => {
    var style = new Style( oneStyle )
    return style.save();
  },

  addStyles: (stylesArray) => {
    return Style.insertMany( stylesArray );
  },

  getProductStyles: (productId) => {
    return Style.find( { productId });
  }

}

