import * as nodeEnv from "node-env-file";
import * as path from "path";

const loadEnvironmentalVariablesFromConfig = function() {
    if (process.env.NODE_ENV != "production") {
        nodeEnv(path.join(__dirname, '../../.env'));
    }
};

export default loadEnvironmentalVariablesFromConfig;