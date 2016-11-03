"use strict";

class BaseRoutes {
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

module.exports = BaseRoutes;