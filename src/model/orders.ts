// @ts-ignore
import client from "../database/database";

export type Orders = {
  id?: number;
  productId?: number;
  quantity?: number;
  userId?: number;
  status?: string;
};

export type OrdersDBResponse = {
  id?: number;
  product_id?: number;
  quantity?: number;
  user_id?: number;
  status?: string;
};

export const convertDBResponseToOrders = (
  dbResponse: OrdersDBResponse,
): Orders => {
  return {
    id: dbResponse.id || 0,
    productId: dbResponse.product_id || 0,
    quantity: dbResponse.quantity || 0,
    userId: dbResponse.user_id || 0,
    status: dbResponse.status || "",
  };
};

export class OrdersService {
  async index(): Promise<Orders[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql: string = "SELECT * FROM ORDERS";

      const result = await conn.query(sql);

      conn.release();

      return result.rows.map((element: OrdersDBResponse): Orders => {
        return convertDBResponseToOrders(element);
      });
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Orders> {
    try {
      const sql: string = "SELECT * FROM ORDERS WHERE user_id=($1)";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return convertDBResponseToOrders(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(orders: Orders): Promise<Orders> {
    try {
      const sql =
        "INSERT INTO ORDERS (product_id, quantity, user_id,status) VALUES($1, $2, $3, $4) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [
        orders.productId,
        orders.quantity,
        orders.userId,
        orders.status,
      ]);
      const order = result.rows[0];
      conn.release();
      return convertDBResponseToOrders(order);
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async update(orders: Orders): Promise<Orders> {
    try {
      const sql =
        "UPDATE ORDERS SET product_id = $1, quantity = $2, user_id =$3,status = $4 WHERE id = $5 RETURNING *";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [
        orders.productId,
        orders.quantity,
        orders.userId,
        orders.status,
        orders.id,
      ]);
      const order = result.rows[0];
      conn.release();
      return convertDBResponseToOrders(order);
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM ORDERS WHERE id=$1";
      // @ts-ignore
      const conn = await client.connect();
      await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async truncate(): Promise<void> {
    try {
      const sql = "TRUNCATE ORDERS RESTART IDENTITY CASCADE";
      // @ts-ignore
      const conn = await client.connect();
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(`Could not truncate order. Error: ${err}`);
    }
  }
}
