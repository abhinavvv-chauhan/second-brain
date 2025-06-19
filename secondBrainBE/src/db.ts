import mongoose, { model, Schema } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGODB_URL!;
mongoose.connect(MONGO_URL);

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
  title: String,
  link: String,
  type: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true }
});

export const LinkModel = model("Links", LinkSchema);
