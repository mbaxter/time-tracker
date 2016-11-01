"use strict";
require('../bootstrap');
const express = require('express');
const bodyParser = require('body-parser');
const ApiRouter = require('../api/api-router');

const app = express();
app.set("port", process.env.PORT || 5000);
app.set('json spaces', 4);

// Middleware
app.use(bodyParser.json({
    type:"application/json" ,
    limit: '50mb'
}));

app.use('/api', ApiRouter.create());

// Helloworld
app.get('/', function (req, res) {
    res.send('Hello World!!');
});

// Listen for incoming requests
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});