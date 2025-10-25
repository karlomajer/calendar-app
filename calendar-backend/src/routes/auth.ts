import { Router, Request, Response } from "express";
import {
  getAuthUrl,
  getTokensFromCode,
  getUserInfo,
} from "../services/googleAuth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/google", (req: Request, res: Response) => {
  const authUrl = getAuthUrl();
  res.json({ authUrl });
});

router.get("/google/callback", async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      return res.status(400).json({ error: "Failed to get tokens" });
    }

    const userInfo = await getUserInfo(tokens.access_token);

    if (!userInfo.email || !userInfo.id) {
      return res.status(400).json({ error: "Failed to get user info" });
    }

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.googleId, userInfo.id));

    let user;

    if (existingUsers.length > 0) {
      const updatedUsers = await db
        .update(users)
        .set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          updatedAt: new Date(),
        })
        .where(eq(users.googleId, userInfo.id))
        .returning();

      user = updatedUsers[0];
    } else {
      const newUsers = await db
        .insert(users)
        .values({
          email: userInfo.email,
          googleId: userInfo.id,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        })
        .returning();

      user = newUsers[0];
    }

    if (req.session) {
      req.session.userId = user.id;
    }

    res.json({
      message: "Authentication successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Auth callback error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  req.session?.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }

    res.json({ message: "Logged out successfully" });
  });
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userList = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (userList.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: userList[0] });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

export default router;
