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
// App components
const App = require('./components/presentational/app');
const LoginPage = require('./components/stateful/login-page');
const SignupPage = require('./components/stateful/signup-page');
const ProfilePage = require('./components/stateful/profile-page');
const TimeTrackerApp = require('./components/stateful/time-tracker-app');
const TimeBlockEditModal = require('./components/stateful/time-block-edit-modal');
const TimeBlockCreateModal = require('./components/stateful/time-block-create-modal');
const TimeBlocksPage = require('./components/presentational/time-blocks-page');
const reducer = require('./reducer');
const subjectSelector = require('./selector/subject-selector');

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
    if (!subjectSelector.authenticated(state)) {
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
                    <IndexRoute component={TimeBlocksPage}/>
                    <Route path="profile" component={ProfilePage}/>
                    <Route path="time-blocks" component={TimeBlocksPage}>
                        <Route path="create" component={TimeBlockCreateModal}/>
                        <Route path="edit/:timeBlockId" component={TimeBlockEditModal}/>
                    </Route>
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

