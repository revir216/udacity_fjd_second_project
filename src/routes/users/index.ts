import express, { Request, Response } from "express";
import { Users, UsersService } from "../../model/users";
import { verifyToken } from "../../jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRouter = express.Router();
const userService = new UsersService();
const { TOKEN_SECRET } = process.env;

const index = async (_req: Request, res: Response) => {
  try {
    const user = await userService.index();
    res.status(200).json(user);
  } catch (err) {}
};

const show = async (_req: Request, res: Response) => {
  try {
    const user = await userService.getDetails(_req.params.id);
    res.status(200).json(user);
  } catch (err) {}
};

const create = async (_req: Request, res: Response) => {
  const user: Users = {
    username: _req.body.username,
    firstname: _req.body.firstname,
    lastname: _req.body.lastname,
    password: _req.body.password,
  };
  try {
    const result = await userService.create(user);
    //@ts-ignore
    var token = jwt.sign({ user: result }, TOKEN_SECRET);
    res.status(200).json(token);
  } catch (err) {
    res.status(401).json(err);
  }
};

const authenticate = async (_req: Request, res: Response) => {
  const user: Users = {
    username: _req.body.username,
    password: _req.body.password,
  };
  try {
    const result = await userService.authenticate(
      user.username,
      user.password || "",
    );
    if (result == null) {
      res.status(401).json("Authentication fail");
    }
    var token = jwt.sign({ user: user.username }, TOKEN_SECRET || "");
    res.status(200).json(token);
  } catch (err) {
    res.status(401).json(err);
  }
};

const update = async (_req: Request, res: Response) => {
  try {
    const user: Users = {
      username: _req.body.username,
      firstname: _req.body.firstname,
      lastname: _req.body.lastname,
      password: _req.body.password,
    };
    const result = await userService.update(user);
    res.status(200).json(result);
  } catch (err) {}
};

const destroy = async (_req: Request, res: Response) => {
  try {
    const user = await userService.delete(_req.body.id);
    res.status(200).json(user);
  } catch (err) {}
};

userRouter.get("", index);
userRouter.get(`/:id`, show);
userRouter.post("", create);
userRouter.post("/login", authenticate);
userRouter.put("", verifyToken, update);
userRouter.delete("", verifyToken, destroy);

export default userRouter;
