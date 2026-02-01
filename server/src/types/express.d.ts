import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId;
      type: "user" | "visitor";
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
