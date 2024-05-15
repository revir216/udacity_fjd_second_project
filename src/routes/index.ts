import express from "express";
import oderRouter from "../routes/orders";
import productRouter from "./products";
import userRouter from "./users";

const routes = express.Router();
routes.use("/order", oderRouter);
routes.use("/product", productRouter);
routes.use("/user", userRouter);

routes.get("", (_req, res): void => {
  res.status(200).send("please check document for specific API");
});
export default routes;
