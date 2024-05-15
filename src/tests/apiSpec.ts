import app from "../server";
import supertest from "supertest";
import { Products, ProductsService } from "../model/products";
import { Users, UsersService } from "../model/users";
import { Orders, OrdersService } from "../model/orders";

const request = supertest(app);
const productServices = new ProductsService();
const userServices = new UsersService();
const orderServices = new OrdersService();
let token = "";
beforeAll(async () => {
  try {
    await orderServices.truncate();
    await productServices.truncate();
    await userServices.truncate();
    const sampleUser: Users = {
      username: "delight",
      firstname: "Nguyen",
      lastname: "Minh Duc2",
      password: "udacityPW1",
    };
    const sampleProduct: Products = {
      name: "Bridge to Terabithia",
      price: 250,
      category: "Book",
    };
    const sampleOrders: Orders = {
      productId: 1,
      quantity: 2,
      userId: 1,
      status: "sold",
    };
    await productServices.create(sampleProduct);
    await userServices.create(sampleUser);
    await orderServices.create(sampleOrders);
    const result = await request.post("/v1/api/user/login").send({
      username: "delight",
      password: "udacityPW1",
    });
    token = result.body;
  } catch (err) {
    console.log(err);
  }
});

describe("REST API Test", (): void => {
  describe("PRODUCT API Test", (): void => {
    it("Test GET v1/api/product response with status 200", async () => {
      const response = await request.get("/v1/api/product");
      expect(response.status).toEqual(200);
    });

    it("Test GET v1/api/product:id response with status 200", async () => {
      const response = await request.get("/v1/api/product/1");
      expect(response.status).toEqual(200);
    });

    it("Test POST v1/api/product response with status 200", async () => {
      const product: Products = {
        name: "Book1",
        price: 20,
        category: "book",
      };

      const response = await request
        .post("/v1/api/product")
        .set("Authorization", `Bearer ${token}`)
        .send(product);
      expect(response.status).toEqual(200);
    });

    it("Test PUT v1/api/product response with status 200", async () => {
      const product: Products = {
        id: 2,
        name: "Book2",
        price: 20,
        category: "book",
      };
      const response = await request
        .put("/v1/api/product")
        .set("Authorization", `Bearer ${token}`)
        .send(product);
      expect(response.status).toEqual(200);
    });

    it("Test DELETE v1/api/product response with status 200", async () => {
      const response = await request
        .delete("/v1/api/product")
        .set("Authorization", `Bearer ${token}`)
        .send({ id: "2" });
      expect(response.status).toEqual(200);
    });
  });

  describe("USER API Test", (): void => {
    it("Test GET v1/api/user response with status 200", async () => {
      const response = await request.get("/v1/api/user");
      expect(response.status).toEqual(200);
    });

    it("Test GET v1/api/user:id response with status 200", async () => {
      const response = await request.get("/v1/api/user/1");
      expect(response.status).toEqual(200);
    });

    it("Test POST v1/api/user response with status 200", async () => {
      const user: Users = {
        username: "lokiskd",
        firstname: "Tran",
        lastname: "Huy Hoang",
        password: "fjkdfl",
      };
      const response = await request.post("/v1/api/user").send(user);
      expect(response.status).toEqual(200);
    });

    it("Test POST v1/api/user/login response with status 200", async () => {
      const user: Users = {
        username: "lokiskd",
        password: "fjkdfl",
      };
      const response = await request.post("/v1/api/user/login").send(user);
      expect(response.status).toEqual(200);
    });

    it("Test PUT v1/api/user response with status 200", async () => {
      const user: Users = {
        username: "lokiskd",
        firstname: "Nguyen",
        lastname: "Huy Hoang",
      };
      const response = await request
        .put("/v1/api/user")
        .set("Authorization", `Bearer ${token}`)
        .send(user);
      expect(response.status).toEqual(200);
    });

    it("Test DELETE v1/api/user response with status 200", async () => {
      const response = await request
        .delete("/v1/api/user")
        .set("Authorization", `Bearer ${token}`)
        .send({ id: "2" });
      expect(response.status).toEqual(200);
    });
  });

  describe("ORDER API Test", (): void => {
    it("Test GET v1/api/order response with status 200", async () => {
      const response = await request.get("/v1/api/order");
      expect(response.status).toEqual(200);
    });

    it("Test GET v1/api/order:id response with status 200", async () => {
      const response = await request
        .get("/v1/api/order/1")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });

    it("Test POST v1/api/order response with status 200", async () => {
      const order: Orders = {
        productId: 1,
        quantity: 4,
        userId: 1,
        status: "sold",
      };

      const response = await request
        .post("/v1/api/order")
        .set("Authorization", `Bearer ${token}`)
        .send(order);
      expect(response.status).toEqual(200);
    });

    it("Test PUT v1/api/order response with status 200", async () => {
      const order: Orders = {
        id: 2,
        productId: 1,
        quantity: 6,
        userId: 1,
        status: "pending",
      };
      const response = await request
        .put("/v1/api/order")
        .set("Authorization", `Bearer ${token}`)
        .send(order);
      expect(response.status).toEqual(200);
    });

    it("Test DELETE v1/api/order response with status 200", async () => {
      const response = await request
        .delete("/v1/api/order")
        .set("Authorization", `Bearer ${token}`)
        .send({ id: "2" });
      expect(response.status).toEqual(200);
    });
  });
});
