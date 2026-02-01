import { Request } from "express";
import { Types } from "mongoose";

export interface AuthUser {
  id: Types.ObjectId;
  type: "user" | "visitor";
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
