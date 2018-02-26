const Nightmare = require('nightmare');
const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const fs = require('graceful-fs');

describe('Load a Page', function() {
  // Recommended: 5s locally, 10s to remote server, 30s from airplane ¯\_(ツ)_/¯
  this.timeout('20s');

  let productJson = {},
      url = 'http://localhost:3333'
      productDetailsArray = [];

  let nightmare = null
  beforeEach(() => {
    nightmare = new Nightmare();
    productJson = JSON.parse(fs.readFileSync('products.json', 'utf8'));
  })

  describe('William Sonoma Test', () => {
    it('should load without error', done => {
      nightmare.goto(url)
        .end()
        .then((result) => {
          done();
        })
        .catch(done)
    });

    it('should create same number of product tiles as products in json', done => {
      nightmare
        .goto(url)
        .evaluate(() => {return document.getElementsByClassName('product-detail')})
        .then(productDetailResults => {
          expect(productDetailResults.length).to.equal(productJson.length)
          done();
        })
        .catch(done)
    })

    it('should open a modal when clicking on a image', done => {
      nightmare
        .goto(url)
        .wait(500)
        .evaluate(() => {
          document.getElementsByClassName('product-detail')[10].firstChild.click();
          return document.getElementById('modal').style.display
        })
        .then(modalStatus => {
          expect(modalStatus).to.equal('block');
          done();
        })
        .catch(done);
    })

    it('should be create same number of thumbnails as the number of images available for that product', done => {
      nightmare
        .goto(url)
        .wait(500)
        .evaluate(() => {
          document.getElementsByClassName('product-detail')[0].firstChild.click();
          return [document.getElementById('thumbnails').childElementCount, document.getElementsByClassName('product-detail')[0].dataset.images.split(',').length]
        })
        .then((result) => {
          expect(result[0]).to.equal(result[1]);
          done();
        })
        .catch(done);
    })
  })
})
