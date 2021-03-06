"use strict";
require('../bootstrap');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const ApiRouter = require('../api/api-router');
const path = require('path');
const preloadedState = require('./preloaded-state/login-creds-json');

const hbsEngine = expressHandlebars({
    defaultLayout: "main",
    extname: "hbs"
});

// Configure
const app = express();
app.set("port", process.env.PORT || 5000);
app.set('json spaces', 4);
app.engine('hbs', hbsEngine);
app.set("view engine", "hbs");

// Middleware
app.use(express.static(path.join(__dirname,'../../../','/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
    type:"application/json" ,
    limit: '50mb'
}));

app.use('/api', ApiRouter.create());

app.get('*', function (request, response){
    response.render("preloaded-state", {storeJson: preloadedState});
});

// Listen for incoming requests
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});