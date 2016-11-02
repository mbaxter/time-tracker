"use strict";

/**
 * Given a series of url segments (host/path followed by one or more path parts)
 * Join the segments together into a single url string
 * @param {string} components
 * @returns {string}
 */
module.exports = function(... components) {
    let finalPath = '';
    for (let i = 0; i < components.length; i++) {
        let component = components[i].trim();
        if (!component) {
            // Skip empty segments
            continue;
        }

        if (finalPath) {
            finalPath += "/" + component;
        } else {
            finalPath = component;
        }
    }

    // Compress multiple slashes into 1
    finalPath = finalPath.replace(/\/+/g,"/");
    // Fix http(s) protocol which should have 2 slashes
    return finalPath.replace(/^(https?):\/([^\/])/, "$1://$2");
};