"use strict";
require('./bootstrap');
const React = require('react');
const ReactDom = require('react-dom');
const ReactRouter = require('react-router');
const Redux = require('redux');
const ReactRedux = require('react-redux');
const App = require('./components/presentational/app');
const reducers = require('./reducers');

const Router = ReactRouter.Router;
const Provider = ReactRedux.Provider;
const Route = ReactRouter.Route;

let store = Redux.createStore(reducers);

ReactDom.render(
    <Provider store={store}>
        <Router history={Router.hashHistory}>
            <Route path = "/" component={App} />
        </Router>
    </Provider>
, document.getElementById('app'));
