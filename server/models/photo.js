const Photo = require('../../database/models/photo.js').Photo;

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