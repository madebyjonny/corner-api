import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../../data/db";
import { users, refreshTokens } from "../../data/schema";
import jwt from "jsonwebtoken";

const auth = express.Router();

auth.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "missing required fields",
    });
  }

  try {
    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    if (!user) {
      return res.status(400).json({
        error: "issue signing in",
      });
    }

    const valid = await Bun.password.verify(password, user.hash as string);

    if (!valid) {
      return res.status(400).json({
        error: "issue signing in",
      });
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "1y" }
    );

    const token = await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: user.id,
    });

    return res.json({
      email: user.email,
      id: user.id,
      accessToken,
      refreshToken,
    });
  } catch (e: any) {
    return res.status(500).json({
      error: e.message,
    });
  }
});

auth.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({
      error: "missing required fields",
    });
  }

  try {
    const hash = await Bun.password.hash(password);

    const userData = {
      email,
      first_name,
      last_name,
      hash,
    };

    const user = await db.insert(users).values(userData).returning({
      id: users.id,
      email: users.email,
      first_name: users.first_name,
      last_name: users.last_name,
      created_at: users.created_at,
      updated_at: users.updated_at,
    });

    return res.status(200).json(user);
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
});

auth.post("/refresh", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: "token not attached",
    });
  }

  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string);

    const result = await db.query.refreshTokens.findFirst({
      where: (refreshTokens, { eq }) => eq(refreshTokens.token, token),
    });

    if (!result) {
      return res.status(400).json({
        error: "token not found",
      });
    }

    const accessToken = jwt.sign(
      { id: result.userId },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      accessToken,
    });
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
});

export default auth;
