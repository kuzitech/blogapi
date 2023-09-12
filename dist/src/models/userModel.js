"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../../db"));
exports.default = {
    /**
     * Find user by username
     *
     * @param username
     * @returns string username
     */
    findByUsername: (username) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield db_1.default.user.findFirst({
                where: {
                    username: username,
                },
            });
            return user;
        }
        catch (error) {
            throw error;
        }
        finally {
            yield db_1.default.$disconnect();
        }
    }),
    /**
     * Find user by email
     *
     * @param username string
     * @param email string
     * @returns
     */
    findByEmailOrUsername: (username, email) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield db_1.default.user.findFirst({
                where: {
                    OR: [{ username }, { email }],
                },
            });
            return user;
        }
        catch (error) {
            throw error;
        }
        finally {
            yield db_1.default.$disconnect();
        }
    }),
    /**
     *
     * @param email string
     * @returns
     */
    findByEmail: (email) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield db_1.default.user.findFirst({
                where: {
                    email,
                },
            });
            return user;
        }
        catch (error) {
            throw error;
        }
        finally {
            yield db_1.default.$disconnect();
        }
    }),
};
//# sourceMappingURL=userModel.js.map