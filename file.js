'use strict';

/*
 *
 *  This file will implements functions reading or writing files
 *
 */

const fs = require('fs');
const cheerio = require('cheerio');

function readHtmlFile(path) {
  let file = fs.readFileSync(path, 'utf8');
  let file_content = file.toString();
  let regex = /(\\r|\\n|\\)/g;
  let content = file_content.replace(regex, '');
  return cheerio.load(content);
}

function writeJsonFile(content, path) {
  fs.writeFileSync(path, content);
}

module.exports.readHtmlFile = readHtmlFile;
module.exports.writeJsonFile = writeJsonFile;
