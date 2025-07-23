import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../packages/backend-common/.env') });

import express, { Request, Response } from "express";
import { ContentModel, LinkModel, UserModel } from "./db";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { z } from "zod";
import cors from "cors";

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());

import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import mongoose from "mongoose";

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is healthy and running." });
});

//@ts-ignore
app.post("/api/v1/signup", async (req, res) => {
    try {
        const requiredBody = z.object({
            username: z.string().min(3).max(30),
            password: z.string()
        })

        const parsedData = requiredBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Invalid input",
                error: parsedData.error.format()
            })
        }
        
        const { username, password } = parsedData.data;
        
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await UserModel.create({
            username: username,
            password: hashedPassword
        });
        
        res.status(201).json({
            message: "User signed up successfully",
            userId: newUser._id
        });
        
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error during signup"
        });
    }
})

// @ts-ignore
app.post("/api/v1/signin", async (req,res) => {
    const requiredBody = z.object({
        username: z.string(),
        password: z.string()
    })

    const parsedData = requiredBody.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({
            message:"Invalid input",
            error: parsedData.error.format()
        })
    }

    const { username, password} = parsedData.data;

    try {
        const existingUser = await UserModel.findOne({
            username,
        })

        if(!existingUser){
            return res.status(403).json({
                message:"User not found"
            })
        }
        
        const passwordMatch = await bcrypt.compare(password, existingUser.password)
        if(passwordMatch){
            const token = jwt.sign({
                id: existingUser._id
            },JWT_SECRET);

            res.json({
                token
            })
        }else{
            res.status(403).json({
                message:"Invalid credentials"
            })
        }
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({
            message: "Internal server error during signin"
        });
    }
})

app.post("/api/v1/content",userMiddleware, async (req,res) => {
    const link = req.body.link;
    const title = req.body.title;
    const type = req.body.type;

    try {
        await ContentModel.create({
            link,
            title,
            type,
            //@ts-ignore
            userId: req.userId,
            tags: []
        })

        res.json({
            message:"Content Created"
        })
    } catch (error) {
        console.error("Content creation error:", error);
        res.status(500).json({
            message: "Error creating content"
        });
    }
})

app.get("/api/v1/content",userMiddleware, async (req,res) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const content = await ContentModel.find({
            userId: userId
        }).populate("userId","username")

        res.json({
            content
        })
    } catch (error) {
        console.error("Get content error:", error);
        res.status(500).json({
            message: "Error fetching content"
        });
    }
})

app.delete("/api/v1/content", userMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.body;

    if (!contentId) {
      res.status(400).json({ message: "Content ID is required" });
      return;
    }

    const result = await ContentModel.deleteOne({
      _id: contentId,
      // @ts-ignore
      userId: req.userId,
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        message: "Content not found or you are not authorized to delete it.",
      });
      return; 
    }

    res.json({ message: "Content deleted successfully" });

  } catch (error) {
    console.error("Delete content error:", error);
    res.status(500).json({ message: "Error deleting content" });
  }
});

app.post("/api/v1/brain/share",userMiddleware, async (req,res) => {
    try {
        const share = req.body.share;
        if(share){
            const existingLink = await LinkModel.findOne({
                //@ts-ignore
                userId: req.userId
            })
            if(existingLink){
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            const hash = random(10)
            await LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            })
            res.json({
                hash:hash
            })
        }else{
            await LinkModel.deleteOne({
                // @ts-ignore
                userId: req.userId
            })
            res.json({
                message: "Deleted link"
            })
        }
    } catch (error) {
        console.error("Share brain error:", error);
        res.status(500).json({
            message: "Error processing share request"
        });
    }
})

app.get("/api/v1/brain/:shareLink",async (req,res) => {
    try {
        const hash = req.params.shareLink;

        const link = await LinkModel.findOne({
            hash
        });

        if(!link){
            res.status(411).json({
                message: "Webpage does not exist"
            });
            return
        }

        const content = await ContentModel.find({
            userId: link.userId
        })
        const user = await UserModel.findOne({
            _id: link.userId
        })

        if(!user){
            res.status(411).json({
                message: "User does not exist"
            });
            return
        }

        res.json({
            username: user?.username,
            content: content 
        })
    } catch (error) {
        console.error("Get shared brain error:", error);
        res.status(500).json({
            message: "Error fetching shared content"
        });
    }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
