"use strict";

const dateFunctions = require("./functions/date");
const extraFunctions = require("./functions/extra");
const arrayFunctions = require("./functions/array");
const objectFunctions = require("./functions/object");
const numberFunctions = require("./functions/number");
const stringFunctions = require("./functions/string");

const shaky = Object.assign({}, extraFunctions, numberFunctions, stringFunctions, dateFunctions, arrayFunctions, objectFunctions);

// console.log(shaky);
module.exports = shaky;
