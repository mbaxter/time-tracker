"use strict";
const express = require('express');
const authMiddleware = require('../middleware/auth');

class BaseRouterFactory {
    /**
     * Returns a router augmented with route handlers.
     * @returns {express.Router}
     */
   static create() {
       let router = express.Router();
       this.setPublicRoutes(router);

       router.use(authMiddleware);

       this.setProtectedRoutes(router);

       return router;
   }

    /**
     * Set public routes that do not require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
   static setPublicRoutes(router) {
       return router;
   }

    /**
     * Set protected routes that require authentication
     * @param {express.Router} router
     * @returns {express.Router}
     */
   static setProtectedRoutes(router) {
      return router;
   }
}

module.exports = BaseRouterFactory;