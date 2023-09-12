"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db = new client_1.PrismaClient();
// Attempt to connect to the database
db.$connect()
    .then((obj) => {
    console.log('Connected to the database');
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
});
exports.default = db;
//# sourceMappingURL=db.js.map