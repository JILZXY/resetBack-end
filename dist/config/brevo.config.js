"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brevoConfig = void 0;
const config_1 = require("@nestjs/config");
exports.brevoConfig = (0, config_1.registerAs)('brevo', () => ({
    apiKey: process.env.BREVO_API_KEY,
    fromEmail: process.env.BREVO_FROM_EMAIL,
    fromName: process.env.BREVO_FROM_NAME,
}));
//# sourceMappingURL=brevo.config.js.map