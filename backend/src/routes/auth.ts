import { Router, type Request, type Response } from "express";
import { users } from "../db.js";
import {
  generateTokens,
  verifyToken,
  createRefreshTokenCookie,
} from "../session.js";

const router = Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    res.status(401).json({
      message: "Incorrect email or password.",
      code: "INVALID_CREDENTIALS",
    });
    return;
  }

  const { accessToken, refreshToken } = await generateTokens({
    userId: user.id,
    email: user.email,
  });

  res.setHeader("Set-Cookie", createRefreshTokenCookie(refreshToken));
  res.json({ accessToken, user: { id: user.id, email: user.email } });
});

router.post(
  "/register",
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (users.some((u) => u.email === email)) {
      res
        .status(400)
        .json({ message: "The user already exists.", code: "USER_EXISTS" });
      return;
    }

    const newUser = { id: String(users.length + 1), email, password };
    users.push(newUser);

    const { accessToken, refreshToken } = await generateTokens({
      userId: newUser.id,
      email: newUser.email,
    });

    res.setHeader("Set-Cookie", createRefreshTokenCookie(refreshToken));
    res
      .status(201)
      .json({ accessToken, user: { id: newUser.id, email: newUser.email } });
  },
);

router.post("/refresh", async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken as string | undefined;

  if (!refreshToken) {
    res.status(401).json({
      message: "Refresh token not found",
      code: "REFRESH_TOKEN_MISSING",
    });
    return;
  }

  try {
    const session = await verifyToken(refreshToken);
    const user = users.find((u) => u.id === session.userId);

    if (!user) throw new Error("User not found");

    const { accessToken, refreshToken: newRefreshToken } =
      await generateTokens({ userId: user.id, email: user.email });

    res.setHeader("Set-Cookie", createRefreshTokenCookie(newRefreshToken));
    res.json({ accessToken, user: { id: user.id, email: user.email } });
  } catch {
    res.status(401).json({
      message: "Invalid refresh token",
      code: "INVALID_REFRESH_TOKEN",
    });
  }
});

export default router;
