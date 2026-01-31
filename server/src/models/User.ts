import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  visitorId?: string;      
  walletId?: string;      
  email?: string;         
  name?: string;           
  username?: string;      
  avatarUrl?: string;     
  createdAt: Date;
  updatedAt: Date;

  todoistAccessToken?: string;
  todoistTokenExpiry?: string
  todoistConnectedAt?: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    visitorId: { type: String, unique: true, sparse: true }, 
    walletId: { type: String, unique: true, sparse: true },

    email: { type: String, unique: true, sparse: true },
    name: { type: String },
    username: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String },

    todoistAccessToken: { type: String, select: false },
    todoistTokenExpiry: { type: String, select: false },
    todoistConnectedAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", UserSchema);
