"use strict";
const FetchApi = require('./fetch-api');

class AuthApi extends FetchApi {

   login(email, password) {
       return this.post("/auth/login", {
                email_address: email,
                password: password
            });
   }
}

module.exports = AuthApi;
