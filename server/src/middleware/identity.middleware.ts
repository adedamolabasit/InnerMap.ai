// src/middleware/identify-user.ts
import { Response, NextFunction } from "express";
import { User as UserModel } from "../models/User";
import { AuthenticatedRequest } from "../types/auth";
import mongoose from "mongoose";

export async function identifyUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const walletId = req.headers["user-id"] as string | undefined;
    const visitorId = req.headers["visitor-id"] as string | undefined;

    let userType: "user" | "visitor" | null = null;
    let identifier: string | undefined;

    if (walletId) {
      userType = "user";
      identifier = walletId;
    } else if (visitorId) {
      userType = "visitor";
      identifier = visitorId;
    }

    if (!identifier || !userType) return next();

    const query =
      userType === "user"
        ? { walletId: identifier }
        : { visitorId: identifier };

    const user = await UserModel.findOneAndUpdate(
      query,
      {
        $setOnInsert: {
          walletId: userType === "user" ? identifier : undefined,
          visitorId: userType === "visitor" ? identifier : undefined,
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    req.user = {
      id: user._id, // ObjectId type
      type: userType,
    };

    next();
  } catch (err) {
    console.error("identifyUser error:", err);
    next(err);
  }
}
