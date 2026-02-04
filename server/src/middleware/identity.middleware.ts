import { Response, NextFunction } from "express";
import { User as UserModel } from "../models/User";
import { AuthenticatedRequest } from "../types/auth";

export async function identifyUser(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const walletAddress = req.headers["wallet-address"] as string | undefined;
    const visitorId = req.headers["visitor-id"] as string | undefined;

    let userType: "user" | "visitor" | null = null;
    let identifier: string | undefined;

    if (walletAddress !== "undefined") {
      userType = "user";
      identifier = walletAddress;
    } else if (visitorId) {
      userType = "visitor";
      identifier = visitorId;
    }

    if (!identifier || !userType) return next();

    const query =
      userType === "user"
        ? { walletAddress: identifier }
        : { visitorId: identifier };

    const user = await UserModel.findOneAndUpdate(
      query,
      {
        $setOnInsert: {
          walletAddress: userType === "user" ? identifier : undefined,
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
