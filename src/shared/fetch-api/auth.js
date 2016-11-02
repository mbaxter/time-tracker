"use strict";
const FetchApi = require('./fetch-api');

class AuthApi extends FetchApi {
    _getBasePath() {
        return "auth";
    }

   login(email, password) {
       return this.post("login", {
                email_address: email,
                password: password
            });
   }
}

module.exports = AuthApi;
