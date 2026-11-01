import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Lets you use req.user anywhere in your project with proper typing
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role?: string };
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

    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "string" || typeof decoded.id !== "string") {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    req.user = decoded as JwtPayload & { id: string; role?: string };
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


export const userAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "User") {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  next();
};
