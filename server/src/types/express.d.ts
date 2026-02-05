import { Types } from "mongoose";
import type { Multer } from "multer";

declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId;
      type: "user" | "visitor";
    }

    interface Request {
      user?: User;
      file?: Multer.File;
    }
  }
}

export {};
