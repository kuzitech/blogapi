"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const tslib_1 = require("tslib");
const dotenv = tslib_1.__importStar(require("dotenv"));
const jwt = tslib_1.__importStar(require("jsonwebtoken"));
const utils_1 = require("../utils");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * verify jwt token for authorization
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res
            .status(401)
            .json({ error: 'Unauthorized', status: utils_1.statusCodes.ACCESS_DENIED });
    }
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    }
    catch (error) {
        res.status(401).json({
            error: 'Unauthorized',
            message: error,
            status: utils_1.statusCodes.ACCESS_DENIED,
        });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=userAuth.js.map