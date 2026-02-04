import { Response, NextFunction } from "express";
import { User as UserModel } from "../models/User";
import { AuthenticatedRequest } from "../types/auth";

export async function identifyUser(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const visitorId = req.headers["visitor-id"] as string | undefined;

    let userType: "user" | "visitor" | null = null;
    let identifier: string | undefined;

   if (visitorId) {
      userType = "visitor";
      identifier = visitorId;
    }

    if (!identifier || !userType) return next();

    const query =  { visitorId: identifier };

    const user = await UserModel.findOneAndUpdate(
      query,
      {
        $setOnInsert: {
          visitorId: userType === "visitor" ? identifier : undefined,
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    req.user = {
      id: user._id,
      type: userType,
    };

    next();
  } catch (err) {
    next(err);
  }
}
