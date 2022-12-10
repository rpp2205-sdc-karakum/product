const request = require('supertest');
const server = require('./server/productService.js');

jest.setTimeout(50000);

describe('GET all Products', () => {

  test('should return Status 200', async () => {
    try {
      const response = await request(server).get('/products');
      expect(response.statusCode).toBe(200);
    }
    catch (err) {
      console.log(err)
      throw err;
    }
  });

  test('should return 20 objects', async () => {
    try {
      const response = await request(server).get('/products');
      expect(response.body.length).toBe(20);
    }
    catch (err) {
      console.log(err)
      throw err;
    }
  });

});

describe('GET one Product', () => {

  test('should return Status 200', async () => {
    try {
      const response = await request(server).get('/products/1');
      expect(response.statusCode).toBe(200);
    }
    catch (err) {
      console.log(err)
      throw err;
    }
  });

  test('should return object with id = 1', async () => {
    try {
      const response = await request(server).get('/products/1');
      expect(response.body.id).toBe('1');
    }
    catch (err) {
      console.log(err)
      throw err;
    }
  });

});

describe('GET one Product Styles', () => {

  test('should return Status 200', async () => {
    try {
      const response = await request(server).get('/products/1/styles');
      expect(response.statusCode).toBe(200);
    }
    catch (err) {
      console.log(err)
      throw err;
    }
  });

  test('should return array of length 6 (presumably styles)', async () => {
    try {
      const response = await request(server).get('/products/1/styles');
      console.log('LOGGGG', response.body.length);
      expect(response.body.results.length).toBe(6);
    }
    catch (err) {
      console.log(err)
      throw err;
    }
  });

});