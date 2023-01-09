const Product = require('../models/product.js');

module.exports = {

  get20Products: async (req, res) => {

    let products = await Product.get20Products()

    res.send(products);
  },

  getProductById: async (req, res) => {

    let products = await Product.getProductById(req.params.product_id)

    res.send(products[0]);
  }

}