"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCodes = exports.generateTestToken = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * generate test token for the test cases
 *
 * @returns string jwt-token
 */
const generateTestToken = () => {
    const payload = {
        userId: 'cdda23f9-b48d-42e6-913c-f9cd910363ab',
    };
    console.log(process.env.JWT_SERCRET);
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
exports.generateTestToken = generateTestToken;
exports.statusCodes = {
    NOT_FOUND: 10001,
    SUCCESSFUL: 10010,
    INVALID: 10040,
    ERROR: 10090,
    ACCESS_DENIED: 10030,
};
//# sourceMappingURL=utils.js.map