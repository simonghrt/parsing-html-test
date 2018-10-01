'use strict';

/*
 *
 *  This file will implements functions reading or writing files
 *
 */

const fs = require('fs');
const cheerio = require('cheerio');

/**
 *  Reads the HTML file and returns Cheerio object with html content
 *  @param{string} Path of the HTML file to read
 *  @returns{object} Cheerio object with html content
 */
function readHtmlFile(path) {
  let file = fs.readFileSync(path, 'utf8');
  let file_content = file.toString();
  let regex = /(\\r|\\n|\\)/g;
  let content = file_content.replace(regex, '');
  return cheerio.load(content);
}


/**
 *  Reads JSON file
 *  @param{string} Path of the JSON file to read
 *  @returns{object} JSON object
 */
function readJsonFile(path) {
  let file = fs.readFileSync(path, 'utf8');
  return JSON.parse(file);
}


/**
 *  Writes the JSON file
 *  @param{object} The JSON content to write
 *  @param{string} The path where to write the file
 */
function writeJsonFile(content, path) {
  // TODO Add verifications that JSON is valid
  fs.writeFileSync(path, content);
}


module.exports.readHtmlFile = readHtmlFile;
module.exports.readJsonFile = readJsonFile;
module.exports.writeJsonFile = writeJsonFile;
