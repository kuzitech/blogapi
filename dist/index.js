"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const bodyParser = tslib_1.__importStar(require("body-parser"));
const blogRoutes_1 = tslib_1.__importDefault(require("./src/routes/blogRoutes"));
const dotenv = tslib_1.__importStar(require("dotenv"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const path = tslib_1.__importStar(require("path"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
dotenv.config();
app.use((0, morgan_1.default)('combined'));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use((0, cors_1.default)());
app.use('/assets', express_1.default.static(path.join(__dirname, 'public/assets')));
app.use('/api', blogRoutes_1.default);
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map