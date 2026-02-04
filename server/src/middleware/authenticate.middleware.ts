import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.user,"hhhh")
    if (req.user?.type === "visitor") {
      next();
    } else {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Access token required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        sub: string;
        type: string;
        walletAddress?: string;
        iat?: number;
        exp?: number;
      };

      if (decoded) {
        next();
      }
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    return res.status(500).json({ message: "Authentication failed" });
  }
};
