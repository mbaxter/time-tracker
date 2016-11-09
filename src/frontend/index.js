"use strict";
require('./bootstrap');
const React = require('react');
const ReactDom = require('react-dom');
const ReactRouter = require('react-router');
const Redux = require('redux');
const ReactRedux = require('react-redux');
const thunkMiddleware = require('redux-thunk').default;
const createLoggerMiddleware = require('redux-logger');
// App components
const App = require('./components/presentational/app');
const LoginPage = require('./components/containers/login-page');
const reducer = require('./reducer');

const Router = ReactRouter.Router;
const Provider = ReactRedux.Provider;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;

const storeMiddleware = [];
if (process.env.NODE_ENV == 'dev') {
    storeMiddleware.push(createLoggerMiddleware());
}
storeMiddleware.push(thunkMiddleware);

let store = Redux.createStore(
    reducer,
    Redux.applyMiddleware(
        ... storeMiddleware
    )
);

ReactDom.render(
    <Provider store={store}>
        <Router history={Router.hashHistory}>
            <Route path = "/" component={App}>
                <IndexRoute component={LoginPage}/>
                <Route path="login" component={LoginPage}></Route>
            </Route>
        </Router>
    </Provider>
, document.getElementById('app'));
