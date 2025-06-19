"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
//@ts-ignore
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requiredBody = zod_1.z.object({
            username: zod_1.z.string().min(3).max(30),
            password: zod_1.z.string()
        });
        const parsedData = requiredBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Invalid input",
                error: parsedData.error.format()
            });
        }
        const { username, password } = parsedData.data;
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield db_1.UserModel.create({
            username: username,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User signed up successfully",
            userId: newUser._id
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error during signup"
        });
    }
}));
// @ts-ignore
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string()
    });
    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input",
            error: parsedData.error.format()
        });
    }
    const { username, password } = parsedData.data;
    try {
        const existingUser = yield db_1.UserModel.findOne({
            username,
        });
        if (!existingUser) {
            return res.status(403).json({
                message: "User not found"
            });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, existingUser.password);
        if (passwordMatch) {
            const token = jsonwebtoken_1.default.sign({
                id: existingUser._id
            }, config_1.JWT_PASSWORD);
            res.json({
                token
            });
        }
        else {
            res.status(403).json({
                message: "Invalid credentials"
            });
        }
    }
    catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({
            message: "Internal server error during signin"
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const title = req.body.title;
    const type = req.body.type;
    try {
        yield db_1.ContentModel.create({
            link,
            title,
            type,
            //@ts-ignore
            userId: req.userId,
            tags: []
        });
        res.json({
            message: "Content Created"
        });
    }
    catch (error) {
        console.error("Content creation error:", error);
        res.status(500).json({
            message: "Error creating content"
        });
    }
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.userId;
        const content = yield db_1.ContentModel.find({
            userId: userId
        }).populate("userId", "username");
        res.json({
            content
        });
    }
    catch (error) {
        console.error("Get content error:", error);
        res.status(500).json({
            message: "Error fetching content"
        });
    }
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentId = req.body.contentId;
        yield db_1.ContentModel.deleteMany({
            contentId,
            //@ts-ignore
            userId: req.userId,
        });
        res.json({
            message: "Deleted"
        });
    }
    catch (error) {
        console.error("Delete content error:", error);
        res.status(500).json({
            message: "Error deleting content"
        });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const share = req.body.share;
        if (share) {
            const existingLink = yield db_1.LinkModel.findOne({
                //@ts-ignore
                userId: req.userId
            });
            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                });
                return;
            }
            const hash = (0, utils_1.random)(10);
            yield db_1.LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            });
            res.json({
                message: "/share/" + hash
            });
        }
        else {
            yield db_1.LinkModel.deleteOne({
                // @ts-ignore
                userId: req.userId
            });
            res.json({
                message: "Deleted link"
            });
        }
    }
    catch (error) {
        console.error("Share brain error:", error);
        res.status(500).json({
            message: "Error processing share request"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.shareLink;
        const link = yield db_1.LinkModel.findOne({
            hash
        });
        if (!link) {
            res.status(411).json({
                message: "Webpage does not exist"
            });
            return;
        }
        const content = yield db_1.ContentModel.find({
            userId: link.userId
        });
        const user = yield db_1.UserModel.findOne({
            _id: link.userId
        });
        if (!user) {
            res.status(411).json({
                message: "User does not exist"
            });
            return;
        }
        res.json({
            username: user === null || user === void 0 ? void 0 : user.username,
            content: content
        });
    }
    catch (error) {
        console.error("Get shared brain error:", error);
        res.status(500).json({
            message: "Error fetching shared content"
        });
    }
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
