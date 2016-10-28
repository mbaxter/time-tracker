"use strict";
const UserRole = require('../../../../shared/constants/user-role');

module.exports = [
    {
        first_name: "Angela",
        last_name: "Lansbury",
        email_address: "admin@test.com",
        password: process.env.ADMIN_PASSWORD,
        role: UserRole.ADMIN,
        timezone: "US/Eastern"
    }
];