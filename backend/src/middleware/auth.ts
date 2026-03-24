import type { Request, Response, NextFunction } from "express";
import { verifyToken, type Session } from "../session.js";

declare global {
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res
      .status(401)
      .json({ message: "No token provided", code: "INVALID_TOKEN" });
    return;
  }

  try {
    req.session = await verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token", code: "INVALID_TOKEN" });
  }
}
