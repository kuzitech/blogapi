"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = {
    uploadImage: (req, res) => {
        try {
            if (!req) {
                return res
                    .status(400)
                    .json({ status: utils_1.statusCodes.ERROR, error: 'Error! Request failed' });
            }
            const filePath = `assets/${req.file.originalname}`;
            return res.status(200).json({
                status: utils_1.statusCodes.SUCCESSFUL,
                message: 'Uploaded Successfully',
                remotePath: filePath,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error, status: utils_1.statusCodes.ERROR });
        }
    },
};
//# sourceMappingURL=fileController.js.map