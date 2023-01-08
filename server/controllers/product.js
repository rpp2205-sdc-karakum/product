const Product = require('../models/product.js');

module.exports = {

  get20Products: async (req, res) => {

    let products = await Product.get20Products().catch((err) => {
      console.log('Unable to get 20 products from the database: ', err);
      res.sendStatus(500);
    })
    res.send(products);
  },

  getProductById: async (req, res) => {

    let products = await Product.getProductById(req.params.product_id).catch((err) => {
      console.log(`Unable to get product: ${req.params.product_id} from the database: `, err);
      res.sendStatus(500);
    })
    res.send(products[0]);
  }

}