"use strict";
module.exports = {
    mysqlConfig: {
        host: process.env.DATABASE_HOST || '127.0.0.1',
        user: "root",
        password: "TFG-Parking1234",
        database: "parkingdb",
        port: 3306
    },
    port: 3000
}