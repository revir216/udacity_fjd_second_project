import express, { Request, Response } from "express";
import { Products, ProductsService } from "../../model/products";
import { verifyToken } from "../../jwt";

const productRouter = express.Router();
const oderService = new ProductsService();

const index = async (_req: Request, res: Response) => {
  try {
    const product = await oderService.index();
    res.status(200).json(product);
  } catch (err) {}
};

const show = async (_req: Request, res: Response) => {
  try {
    const order = await oderService.show(_req.params.id);
    res.status(200).json(order);
  } catch (err) {}
};

const create = async (_req: Request, res: Response) => {
  try {
    const product: Products = {
      name: _req.body.name,
      price: _req.body.price,
      category: _req.body.category,
    };
    const result = await oderService.create(product);
    res.status(200).json(result);
  } catch (err) {}
};

const update = async (_req: Request, res: Response) => {
  try {
    const product: Products = {
      id: _req.body.id,
      name: _req.body.name,
      price: _req.body.price,
      category: _req.body.category,
    };
    const result = await oderService.update(product);
    res.status(200).json(result);
  } catch (err) {}
};

const destroy = async (_req: Request, res: Response) => {
  try {
    const product = await oderService.delete(_req.body.id);
    res.status(200).json(product);
  } catch (err) {}
};

productRouter.get("", index);
productRouter.get(`/:id`, show);
productRouter.post("", verifyToken, create);
productRouter.put("", verifyToken, update);
productRouter.delete("", verifyToken, destroy);

export default productRouter;
