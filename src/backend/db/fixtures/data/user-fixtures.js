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
    },
    {
        first_name: "Fred",
        last_name: "Astaire",
        email_address: "user@test.com",
        password: "12345",
        role: UserRole.STANDARD,
        timezone: "US/Eastern"
    }
];