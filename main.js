'use strict';

/*
 *
 *  This file will run the main code
 *
 */

const {readHtmlFile, writeJsonFile} = require('./file.js');
const {parseHtml} = require('./parser.js');

const HTML_FILE_PATH = './test.html';
const JSON_RESULT_PATH = './res.json';

let html = readHtmlFile(HTML_FILE_PATH);
let json = parseHtml(html);
writeJsonFile(JSON.stringify(json, null, 2), JSON_RESULT_PATH);
