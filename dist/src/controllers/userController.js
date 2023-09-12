"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv = tslib_1.__importStar(require("dotenv"));
const bcrypt = tslib_1.__importStar(require("bcrypt"));
const jwt = tslib_1.__importStar(require("jsonwebtoken"));
const userModel_1 = tslib_1.__importDefault(require("../models/userModel"));
const db_1 = tslib_1.__importDefault(require("../../db"));
const utils_1 = require("../utils");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[$#!@+=\-?()%]).{8,20}$/;
exports.default = {
    /**
     * Register a user
     *
     * @param req Request
     * @param res Response
     * @param next
     * @returns object
     */
    registerUser: (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res
                .status(400)
                .json({ error: 'Parameters are required and cannot be empty' });
        }
        if (!email.match(EMAIL_REGEX)) {
            return res
                .status(400)
                .json({ error: 'Email is invalid', status: utils_1.statusCodes.INVALID });
        }
        if (!password.match(PASSWORD_REGEX)) {
            return res
                .status(400)
                .json({ error: 'Password is invalid', status: utils_1.statusCodes.INVALID });
        }
        try {
            const usernameValid = username.match(/^[a-zA-Z]{1,15}$/);
            if (!usernameValid) {
                return res
                    .status(400)
                    .json({ message: 'Username is invalid', status: utils_1.statusCodes.ERROR });
            }
            const existingUsername = yield userModel_1.default.findByUsername(username);
            if (existingUsername) {
                return res.status(400).json({
                    message: 'Username is not available',
                    status: utils_1.statusCodes.ERROR,
                });
            }
            const existingEmail = yield userModel_1.default.findByEmail(email);
            if (existingEmail) {
                return res.status(400).json({
                    message: 'Email already existed and cannot be used',
                    status: utils_1.statusCodes.ERROR,
                });
            }
            const hashedPassword = yield bcrypt.hash(password, 10);
            const newUser = { username, password: hashedPassword, email };
            yield db_1.default.user.create({
                data: {
                    username: newUser.username,
                    password: newUser.password,
                    email: newUser.email,
                },
            });
            res.status(201).json({
                message: 'User registered successfully',
                status: utils_1.statusCodes.SUCCESSFUL,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'An error occurred while registering the user',
                message: error,
                status: utils_1.statusCodes.ERROR,
            });
        }
    }),
    /**
     * log the user in
     *
     * @param req Request
     * @param res Response
     * @param next
     * @returns object jwt-token
     */
    loginUser: (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: 'Username and password are required' });
        }
        try {
            const user = yield userModel_1.default.findByUsername(username);
            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            const passwordsMatch = yield bcrypt.compare(password, user.password);
            if (!passwordsMatch) {
                return res.status(401).json({
                    error: 'Invalid username or password. Check your inputs and try again',
                });
            }
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
                expiresIn: '1h',
            });
            // if (!token) {
            //   return res.status(500).json({ error: 'Error while creating token' });
            // }
            res.json({
                timespan: '1 hour',
                token,
                status: utils_1.statusCodes.SUCCESSFUL,
                userId: user.id,
            });
        }
        catch (error) {
            res.status(500).json({ error: 'An error occurred while logging in' });
        }
    }),
    /**
     * find user using the username
     *
     * @param req
     * @param res
     * @returns object user
     */
    findUser: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        res.setTimeout(10000);
        const { username } = req.body;
        if (!username || !username.match(/^[a-zA-Z]{1,15}$/)) {
            return res.status(400).json({
                error: 'Username parameter is required or invalid',
                status: utils_1.statusCodes.INVALID,
            });
        }
        try {
            const user = yield userModel_1.default.findByUsername(username);
            if (!user) {
                return res.status(404).json({
                    error: 'User does not exist',
                    status: utils_1.statusCodes.NOT_FOUND,
                });
            }
            delete user.password;
            return res.status(200).json({ status: utils_1.statusCodes.SUCCESSFUL, user });
        }
        catch (error) {
            return res
                .status(500)
                .json({ error: 'Internal Server Error', status: utils_1.statusCodes.ERROR });
        }
    }),
};
//# sourceMappingURL=userController.js.map