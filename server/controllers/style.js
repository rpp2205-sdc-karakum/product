const Style = require('../models/style.js');
const Photo = require('../models/photo.js');
const Sku = require('../models/sku.js');

module.exports = {

  getProductStyles: async (req, res) => {

    // get styles (no photos or skus yet) for the product
    let styles = await Style.getProductStyles(req.params.product_id);

    // for each style, get the photos and skus for that style and add them
    for (style of styles) {
      let photos = await Photo.getPhotosForStyle(style.id);
      let skus = await Sku.getSkusForStyle(style.id);
      style.photos = photos;
      style.skus = skus;
    }

    let final = {
      product_id: req.params.product_id,
      results: styles
    }

    res.send(final);

  }

}
