import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Lets you use req.user anywhere in your project with proper typing
declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token: string | undefined =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Token not found" });
      return;
    }

    const secret = process.env.SECRET_KEY;
    if (!secret) {
      throw new Error("SECRET_KEY is not configured");
    }

    req.user = jwt.verify(token, secret);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // covers invalid signature and expired tokens
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
    next(error);
  }
};