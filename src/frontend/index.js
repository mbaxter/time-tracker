"use strict";
const bootstrap = require('./bootstrap');
const $ = bootstrap.$;
const React = require('react');
const ReactDom = require('react-dom');
const ReactRouter = require('react-router');
const Redux = require('redux');
const ReactRedux = require('react-redux');
const thunkMiddleware = require('redux-thunk').default;
const createLoggerMiddleware = require('redux-logger');
const get = require('lodash/get');
// App components
const App = require('./components/presentational/app');
const LoginPage = require('./components/stateful/login-page');
const SignupPage = require('./components/stateful/signup-page');
const TimeTrackerApp = require('./components/stateful/time-tracker-app');
const HomePage = require('./components/presentational/home-page');
const reducer = require('./reducer');

const Router = ReactRouter.Router;
const Provider = ReactRedux.Provider;
const Route = ReactRouter.Route;
const IndexRedirect = ReactRouter.IndexRedirect;
const IndexRoute = ReactRouter.IndexRoute;

const storeMiddleware = [];
storeMiddleware.push(thunkMiddleware);
if (process.env.NODE_ENV == 'development') {
    storeMiddleware.push(createLoggerMiddleware());
}

let store = Redux.createStore(
    reducer,
    Redux.applyMiddleware(
        ... storeMiddleware
    )
);

const requireAuthentication = (nextState, replace) => {
    const state = store.getState();
    if (!get(state, 'credentials.authenticated', false)) {
        replace('/login');
    }
};

$.ready(ReactDom.render(
    <Provider store={store}>
        <Router history={Router.hashHistory}>
            <Route path = "/" component={App}>
                {/* Public routes */}
                <IndexRoute component={LoginPage}/>
                <Route path="login" component={LoginPage}/>
                <Route path="signup" component={SignupPage}/>
                {/* Authenticated routes */}
                <Route path="app" component={TimeTrackerApp} onEnter={requireAuthentication}>
                    <IndexRoute component={HomePage}/>
                </Route>
            </Route>
            {/* Catch-all redirect */}
            <Route path="*" component={App}>
                <IndexRedirect to="/app" />
            </Route>
        </Router>
    </Provider>
    , document.getElementById('app'))
);

