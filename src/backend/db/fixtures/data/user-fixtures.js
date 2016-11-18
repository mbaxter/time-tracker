"use strict";
const UserRole = require('../../../../shared/constants/user-role');

module.exports = [
    {
        first_name: "Joe",
        last_name: "Admin",
        email_address: "admin@test.com",
        password: process.env.ADMIN_PASSWORD,
        role: UserRole.ADMIN,
        timezone: "US/Eastern"
    },
    {
        first_name: "Jane",
        last_name: "Demo",
        email_address: "demo@test.com",
        password: "12345",
        role: UserRole.STANDARD,
        timezone: "US/Eastern"
    }
];