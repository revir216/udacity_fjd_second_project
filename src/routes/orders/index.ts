import express, { Request, Response } from "express";
import { Orders, OrdersService } from "../../model/orders";
import { verifyToken } from "../../jwt";

const orderRouter = express.Router();
const oderService = new OrdersService();

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await oderService.index();
    res.status(200).json(orders);
  } catch (err) {}
};

const show = async (_req: Request, res: Response) => {
  try {
    const order = await oderService.show(parseInt(_req.params.id));
    res.status(200).json(order);
  } catch (err) {}
};

const create = async (_req: Request, res: Response) => {
  try {
    const order: Orders = {
      productId: _req.body.productId,
      quantity: _req.body.productId,
      userId: _req.body.userId,
      status: _req.body.status,
    };
    const result = await oderService.create(order);
    res.status(200).json(result);
  } catch (err) {}
};

const update = async (_req: Request, res: Response) => {
  try {
    const order: Orders = {
      id: _req.body.id,
      productId: _req.body.productId,
      quantity: _req.body.productId,
      userId: _req.body.userId,
      status: _req.body.status,
    };
    const result = await oderService.update(order);
    res.status(200).json(result);
  } catch (err) {}
};

const destroy = async (_req: Request, res: Response) => {
  try {
    const orders = await oderService.delete(_req.body.id);
    res.status(200).json(orders);
  } catch (err) {}
};

orderRouter.get("", index);
orderRouter.get(`/:id`, verifyToken, show);
orderRouter.post("", verifyToken, create);
orderRouter.put("", verifyToken, update);
orderRouter.delete("", verifyToken, destroy);

export default orderRouter;
