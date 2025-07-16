"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({
            message: "Authentication token is required"
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (decoded && typeof decoded === 'object' && 'id' in decoded) {
            // @ts-ignore
            req.userId = decoded.id;
            next();
        }
        else {
            throw new Error('Invalid token payload');
        }
    }
    catch (err) {
        res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};
exports.userMiddleware = userMiddleware;
