import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export const userMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({
            message: "Authentication token is required"
        });
        return; 
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && typeof decoded === 'object' && 'id' in decoded) {
            // @ts-ignore
            req.userId = decoded.id;
            next(); 
        } else {
            throw new Error('Invalid token payload');
        }
    } catch (err) {
        res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};