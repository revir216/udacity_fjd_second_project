import { Products, ProductsService } from "../model/products";
import { Users, UsersService } from "../model/users";
import { Orders, OrdersService } from "../model/orders";

const productServices = new ProductsService();
const userServices = new UsersService();
const orderServices = new OrdersService();

describe("FUNCTIONAL Test", (): void => {
  describe("PRODUCT model Test Results", () => {
    it("should have an index method", () => {
      expect(productServices.index).toBeDefined();
    });

    it("should have a show method", () => {
      expect(productServices.show).toBeDefined();
    });

    it("should have a create method", () => {
      expect(productServices.create).toBeDefined();
    });

    it("should have a update method", () => {
      expect(productServices.update).toBeDefined();
    });

    it("should have a delete method", () => {
      expect(productServices.delete).toBeDefined();
    });

    it("index method should return a list of products", async () => {
      const result = await productServices.index();
      expect(result).toEqual([
        {
          id: 1,
          name: "Bridge to Terabithia",
          price: 250,
          category: "Book",
        },
      ]);
    });

    it("create method should add a product", async () => {
      const result = await productServices.create({
        name: "Shadow of Death",
        price: 250,
        category: "Book",
      });
      expect(result).toEqual({
        id: 3,
        name: "Shadow of Death",
        price: 250,
        category: "Book",
      });
    });

    it("update method should update a product", async () => {
      const result = await productServices.update({
        id: 3,
        name: "A Red Square",
        price: 233,
        category: "Book",
      });
      expect(result).toEqual({
        id: 3,
        name: "A Red Square",
        price: 233,
        category: "Book",
      });
    });

    it("show method should return the correct product", async () => {
      const result = await productServices.show("1");
      expect(result).toEqual({
        id: 1,
        name: "Bridge to Terabithia",
        price: 250,
        category: "Book",
      });
    });

    it("delete method should remove the product", async () => {
      await productServices.delete("3");
      const result = await productServices.index();
      expect(result).toEqual([
        {
          id: 1,
          name: "Bridge to Terabithia",
          price: 250,
          category: "Book",
        },
      ]);
    });
  });

  describe("USER model Test Results", () => {
    it("should have an index method", () => {
      expect(userServices.index).toBeDefined();
    });

    it("should have a show method", () => {
      expect(userServices.show).toBeDefined();
    });

    it("should have a create method", () => {
      expect(userServices.create).toBeDefined();
    });

    it("should have a update method", () => {
      expect(userServices.update).toBeDefined();
    });

    it("should have a delete method", () => {
      expect(userServices.delete).toBeDefined();
    });

    it("index method should return a list of users", async () => {
      const result = await userServices.index();
      expect(result).toEqual([
        {
          id: 1,
          username: "delight",
          firstname: "Nguyen",
          lastname: "Minh Duc2",
        },
      ]);
    });

    it("create method should add a user", async () => {
      const result: Users = await userServices.create({
        username: "revir21690",
        firstname: "Nguyen",
        lastname: "Minh Duc",
        password: "udacity",
      });
      expect(result).toEqual({
        id: 3,
        username: "revir21690",
        firstname: "Nguyen",
        lastname: "Minh Duc",
      });
    });

    it("update method should update an user", async () => {
      const result = await userServices.update({
        username: "revir21690",
        firstname: "Hoai",
        lastname: "An",
      });
      expect(result).toEqual({
        username: "revir21690",
        firstname: "Hoai",
        lastname: "An",
      });
    });

    it("show method should return the correct user", async () => {
      const result = await userServices.show(1);
      expect(result).toEqual([
        {
          id: 1,
          username: "delight",
          firstname: "Nguyen",
          lastname: "Minh Duc2",
        },
      ]);
    });

    it("delete method should remove the user", async () => {
      await userServices.delete("3");
      const result = await userServices.index();
      expect(result).toEqual([
        {
          id: 1,
          username: "delight",
          firstname: "Nguyen",
          lastname: "Minh Duc2",
        },
      ]);
    });
  });

  describe("ORDER model Test Results", () => {
    it("should have an index method", () => {
      expect(orderServices.index).toBeDefined();
    });

    it("should have a show method", () => {
      expect(orderServices.show).toBeDefined();
    });

    it("should have a create method", () => {
      expect(orderServices.create).toBeDefined();
    });

    it("should have a update method", () => {
      expect(orderServices.update).toBeDefined();
    });

    it("should have a delete method", () => {
      expect(orderServices.delete).toBeDefined();
    });

    it("index method should return a list of orders", async () => {
      const result = await orderServices.index();
      expect(result).toEqual([
        {
          id: 1,
          productId: 1,
          quantity: 2,
          userId: 1,
          status: "sold",
        },
      ]);
    });

    it("create method should add a order", async () => {
      const result: Orders = await orderServices.create({
        productId: 1,
        quantity: 3,
        userId: 1,
        status: "sold",
      });
      expect(result).toEqual({
        id: 3,
        productId: 1,
        quantity: 3,
        userId: 1,
        status: "sold",
      });
    });

    it("update method should update an order", async () => {
      const result: Orders = await orderServices.update({
        id: 3,
        productId: 1,
        quantity: 15,
        userId: 1,
        status: "sold",
      });

      expect(result).toEqual({
        id: 3,
        productId: 1,
        quantity: 15,
        userId: 1,
        status: "sold",
      });
    });

    it("show method should return the correct order", async () => {
      const result = await orderServices.show(1);
      expect(result).toEqual({
        id: 1,
        productId: 1,
        quantity: 2,
        userId: 1,
        status: "sold",
      });
    });

    it("delete method should remove the order", async () => {
      await orderServices.delete(3);
      const result = await orderServices.index();
      expect(result).toEqual([
        {
          id: 1,
          productId: 1,
          quantity: 2,
          userId: 1,
          status: "sold",
        },
      ]);
    });
  });
});
