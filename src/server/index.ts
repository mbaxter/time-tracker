/// <reference path="../../node_modules/@types/node/index.d.ts"/>
/// <reference types="node" />
import * as express from "express";
import * as bodyParser from "body-parser";
import env from "../env/index.js";

// Setup environmental variables for local development
env();

const app = express();
app.set("port", process.env.port || 5000);
app.set('json spaces', 4);

// Middleware
app.use(bodyParser.json({
    type:"application/json" ,
    limit: '50mb'
}));

// Helloworld
app.get('/', function (req, res) {
    res.send('Hello World!!');
});

// Listen for incoming requests
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});