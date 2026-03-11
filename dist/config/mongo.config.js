"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConfig = void 0;
const config_1 = require("@nestjs/config");
exports.mongoConfig = (0, config_1.registerAs)('mongo', () => ({
    url: process.env.MONGO_URL,
}));
//# sourceMappingURL=mongo.config.js.map