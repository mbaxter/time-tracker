"use strict";
/**
 * Utility for producing string permutations.
 * Given an array like ['a', ['b','c']] produces: 'ab', 'ac'.
 * Each element in the input array is either a string representing a known segment of each output string,
 * or an array representing options for this segment of the output string.
 * Elements are joined from left to right to create string permutations.
 *
 * @param {...(string|string[])[]} componentList An array of strings and strings[]. Represents known (string) and
 * variable (string[]) segments of the output strings.
 * @return {string[]} Generates a list of all possible permutations
 */
const stringPermutations = function*(...componentList) {
    for (let i = 0; i < componentList.length; i++) {
        let components = componentList[i];
        yield* buildPermutationsFromComponentList(components);
    }
};

const buildPermutationsFromComponentList = function*(components, nextComponentIndex = 0, prefix = '') {
    if (nextComponentIndex == components.length) {
        yield prefix;
        return;
    }

    let component = components[nextComponentIndex];
    if (Array.isArray(component)) {
        // An array represents a series of possible options for this segment of the string
        for (let j = 0; j < component.length; j++) {
            yield* buildPermutationsFromComponentList(components, nextComponentIndex + 1, prefix + component[j]);
        }
    } else {
        yield* buildPermutationsFromComponentList(components, nextComponentIndex + 1, prefix + component);
    }
};

module.exports = stringPermutations;