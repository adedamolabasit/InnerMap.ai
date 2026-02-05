import { Request, Response } from "express";
import axios from "axios";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

export const authLogin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        type: req.user.type,
        walletAddress: user.walletAddress ?? null,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        type: req.user.type,
        walletAddress: user.walletAddress ?? null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

export const authTodoist = async (req: Request, res: Response) => {
  try {
    const { dreamId, userId } = req.params;

    const statePayload = {
      userId,
      dreamId,
    };

    const state = Buffer.from(JSON.stringify(statePayload)).toString("base64");

    const params = new URLSearchParams({
      client_id: process.env.TODOIST_CLIENT_ID!,
      scope: "data:read_write",
      state: state,
    });
    res.redirect(`https://todoist.com/oauth/authorize?${params.toString()}`);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete dream" });
  }
};

export const authTodoisCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code || !state || typeof state !== "string") {
      return res.status(400).json({ error: "Missing code or state" });
    }

    const decodedState = JSON.parse(
      Buffer.from(state, "base64").toString("utf-8"),
    );

    const { userId, dreamId } = decodedState;

    const response = await axios.post(
      "https://todoist.com/oauth/access_token",
      {
        client_id: process.env.TODOIST_CLIENT_ID!,
        client_secret: process.env.TODOIST_CLIENT_SECRET!,
        code,
      },
    );

    const { access_token, expires_in } = response.data;

    await User.updateOne(
      { visitorId: userId },
      {
        $set: {
          todoistAccessToken: access_token,
          todoistTokenExpiry: expires_in,
          todoistConnectedAt: new Date(),
        },
      },
    );

    res.redirect(
      `${process.env.ALLOWED_CLIENT_URL}/?view=details&dreamId=${dreamId}`,
    );
  } catch (err) {
    res.status(500).json({ error: "Todoist auth failed" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const profile = await User.findById(userId).select(
      "+todoistAccessToken +todoistTokenExpiry +todoistConnectedAt",
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
