import jwt from "jsonwebtoken";
import { Request, Response } from "express";

//@ts-ignore
export const verifyToken = (req: Request, res: Response, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    //@ts-ignore
    jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    res.status(401).json("Access denied, invalid token");
    return;
  }
};
