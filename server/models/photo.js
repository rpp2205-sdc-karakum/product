const Photo = require('../../database/models/photo.js').Photo;
const db = require('../../database/index.js');

module.exports =  {

  clearPhoto: () => {
    return Photo.deleteMany();
  },

  getPhotosForStyle: (styleId) => {
    return Photo.find( { styleId });
  },

  addPhotos: (photosArray) => {
    return Photo.insertMany( photosArray );
  }

}