"use strict";
const $ = require('jquery');

$.fn.toJSON = function() {
    const data = this.serializeArray();
    const json = {};
    const arrayKeys = {};
    for (let i = 0; i < data.length; i++) {
        const key = data[i].name;
        const value = data[i].value;
        if (typeof json[key] != 'undefined') {
           // We already have a value for this key, save an array
           if (arrayKeys[key]) {
               // We've already converted this key into an array, just append
               json[key].push(value);
           } else {
               // This is the second element with this key value
               // We need to convert the value to an array
               const originalValue = json[key];
               json[key] = [originalValue, value];
               arrayKeys[key] = true;
           }
        } else {
            json[key] = value;
        }
    }

    return json;
};

module.exports = $;
