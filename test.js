'use strict';

/*
 *
 *  This file tests some parts of our code
 *
 */

const assert = require('assert');
const {readJsonFile} = require('./file.js');

describe('Verification same JSON file', function() {
  let original = {};
  let recent = {};
  
  before(function() {
    original = readJsonFile('./test-result.json');
    recent = readJsonFile('./res.json');
  });

  it('should have same code', function() {
    assert.equal(original["result"]["trips"][0]["code"], recent["result"]["trips"][0]["code"]);
  });

  it('should have same total price', function() {
    assert.equal(original["result"]["trips"][0]["details"]["price"], recent["result"]["trips"][0]["details"]["price"]);
  });
});
