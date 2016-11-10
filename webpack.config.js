"use strict";
const env = require('./src/backend/bootstrap/env');
const path = require('path');
const webpack = require('webpack');

// Setup environmental variables to be exported to frontend via EnvionrmentPlugin
env();

module.exports = {
    entry: "./src/frontend",
    output: {
        path: path.join(__dirname, "public", "js"),
        filename: "app.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ["es2015", "react"],
                    plugins: ["transform-object-rest-spread", "transform-bluebird"]
                }
            }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin([
            "NODE_ENV",
            "API_URL"
        ])
    ],
    externals: {
        "jquery": "$",
        "moment": "moment",
        "moment-timezone": "moment",
        "react": "React",
        "react-dom": "ReactDOM",
        "react-router": "ReactRouter"
    }
};