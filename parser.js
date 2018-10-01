'use strict';

/*
 *
 * This file will parse the HTML element and return the correct JSON output
 *
 */

const moment = require('moment');
const cheerio = require('cheerio');

// We set the moment locale variable
moment.locale('fr');

/**
 *  Inits the JSON object
 *  @returns {object} JSON object created with multiple instantiations
 */
function initJson() {
  let json_result = {};
  json_result["result"] = {};
  json_result["result"]["trips"] = [];
  let details = {};
  json_result["result"]["trips"].push(details);
  json_result["result"]["trips"][0]["details"] = {};
  json_result["result"]["trips"][0]["details"]["roundTrips"] = [];
  
  return json_result;
}


/**
 *  Parses informations about trips
 *  @param {string} Date of the trip
 *  @param {object} Details about the trip
 *  @returns {object} JSON object with details parsed
 */
function parseRoundTrip(date, details) {
  let dateFormat = moment(date + "2016", "dddd DD MMMM YYYY");
  
  const detailsHtml = cheerio.load(details, {
    normalizeWhitespace: true,
    xmlMode: true  
  });
  
  let result = {};
  result["type"] = detailsHtml(".travel-way").text();
  result["date"] = dateFormat.toString();
  result["trains"] = [];
  let train = {};
  train["departureTime"] = detailsHtml(".origin-destination-hour.segment-departure").text();
  train["departureStation"] = detailsHtml(".origin-destination-station.segment-departure").text();
  train["arrivalTime"] = detailsHtml(".origin-destination-hour.segment-arrival").text();
  train["arrivalStation"] = detailsHtml(".origin-destination-station.segment-arrival").text();
  let addDetails = detailsHtml(".segment").toArray().map((x) => {return detailsHtml(x).text()});
  train["type"] = addDetails[0];
  train["number"] = addDetails[1];
  result["trains"].push(train);
  
  return result;
}


/**
 *  Parses informations about passengers
 *  @param{object} Html object created by Cheerio
 *  @returns{object} Informations parsed about passengers
 */
function parsePassengers(html) {
  let pass = html(".passengers").toArray().map((x) => {return html(x).html()});
  const passengersHtml = cheerio.load(pass[0], {
    normalizeWhitespace: true,
    xmlMode: true  
  });
  let passengers = [];
  let passengerAges = passengersHtml(".typology").toArray().map((x) => {return passengersHtml(x).text()});
  let passengerTypes = passengersHtml(".fare-details").toArray().map((x) => {return passengersHtml(x).text()});
  let regexAge = /\(([^()]+)\)/g;
  for (let i = 0; i < passengerAges.length; i++) {
    let passenger = {};
    passenger["age"] = passengerAges[i].match(regexAge)[0];
    if (passengerTypes[i].includes("Billet échangeable")) {
      passenger["type"] = "échangeable";
    } else {
      passenger["type"] = "non échangeable";
    }
    passengers.push(passenger);
  }
  return passengers;
}

/**
 *  Parses the main html content
 *  @param{object} Object with HTML content created by Cheerio
 *  @returns{object} JSON result with all informations
 */
function parseHtml(html) {
  let json_result = initJson();

  // Status
  if (html("#intro-title").text().includes("Confirmation")) {
    json_result["status"] = "ok";
  } else {
    json_result["status"] = "error";
  }

  // Total price
  json_result["result"]["trips"][0]["details"]["price"] = html(".total-amount .very-important").text();
  
  // Trips
  let tripsDate = html(".product-travel-date").toArray().map((x) => {return html(x).html()});
  let tripsDetails = html(".product-details").toArray().map((x) => {return html(x).html()});
  for (let i = 0; i < tripsDate.length; i++) {
    json_result["result"]["trips"][0]["details"]["roundTrips"].push(parseRoundTrip(tripsDate[i], tripsDetails[i]));
  }

  // Passengers
  json_result["result"]["trips"][0]["details"]["roundTrips"][tripsDate.length - 1]["passengers"] = parsePassengers(html);

  // Prices
  json_result["result"]["custom"] = {};
  json_result["result"]["custom"]["prices"] = [];
  let cellPrices = html(".product-header .cell, .product-header .amount").toArray().map((x) => {return html(x).text()});
  cellPrices.forEach((price) => {
    if (price.includes("€")) {
      json_result["result"]["custom"]["prices"].push(price);
    }
  });

  // Code and name
  let pnrInfos = html(".block-pnr").toArray().map((x) => {return html(x).html()});
  pnrInfos.forEach((pnr) => {
    if (!pnr.includes("pnr-summary")) {
      const pnrHtml = cheerio.load(pnr, {
        normalizeWhitespace: true,
        xmlMode: true  
      });
      json_result["result"]["trips"][0]["code"] = pnrHtml(".pnr-ref .pnr-info").text();
      json_result["result"]["trips"][0]["name"] = pnrHtml(".pnr-name .pnr-info").text();
    }
  });

  return json_result;
}

module.exports.parseHtml = parseHtml;
