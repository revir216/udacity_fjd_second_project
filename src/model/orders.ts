// @ts-ignore
import client from "../database/database";

export type Orders = {
  id?: number;
  details?: Array<OrderDetails>;
  userId?: number;
  status?: string;
};

interface OrderDetails {
  productId: number;
  quantity: number;
}

export type OrdersDBResponse = {
  id?: number;
  product_id: number;
  quantity: number;
  user_id?: number;
  status?: string;
};

export const convertDBResponseToOrders = (
  orderResponse: Array<OrdersDBResponse>,
): Array<Orders> => {
  let currentOrder: Orders = {
    id: 0,
    details: [],
  };
  let currentOrderDetail: Array<OrderDetails> = [];
  let result: Array<Orders> = [];
  if (!orderResponse.length) {
    return [];
  }
  orderResponse.forEach((element) => {
    const orderDetail: OrderDetails = {
      productId: element.product_id,
      quantity: element.quantity,
    };
    if (currentOrder.id !== element.id) {
      currentOrderDetail = [];
      currentOrderDetail.push(orderDetail);
      currentOrder = {
        id: element.id,
        details: currentOrderDetail,
        userId: element.user_id,
        status: element.status,
      };
      result.push(currentOrder);
    } else {
      currentOrderDetail.push(orderDetail);
    }
  });
  return result;
};

export class OrdersService {
  async index(): Promise<Orders[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql: string =
        "SELECT O.id,O.user_id,OD.product_id,OD.quantity,O.status FROM ORDERS O JOIN ORDER_DETAILS OD ON O.id = OD.order_id";
      const result = await conn.query(sql);
      conn.release();
      return convertDBResponseToOrders(result.rows);
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Array<Orders>> {
    try {
      const sql: string =
        "SELECT O.id,O.user_id,OD.product_id,OD.quantity,O.status FROM ORDERS O JOIN ORDER_DETAILS OD ON O.id = OD.order_id WHERE O.user_id=($1)";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return convertDBResponseToOrders(result.rows);
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async getOrderById(id: number): Promise<Array<Orders>> {
    try {
      const sql: string =
        "SELECT O.id,O.user_id,OD.product_id,OD.quantity,O.status FROM ORDERS O JOIN ORDER_DETAILS OD ON O.id = OD.order_id WHERE O.id=($1)";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return convertDBResponseToOrders(result.rows);
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(orders: Orders): Promise<Orders> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sqlInsertOrder =
        "INSERT INTO ORDERS (user_id,status) VALUES($1, $2) RETURNING id,user_id,status";

      const orderResult = await conn.query(sqlInsertOrder, [
        orders.userId,
        orders.status,
      ]);
      const result: Orders = {
        id: orderResult.rows[0].id,
        details: [],
        userId: orderResult.rows[0].user_id,
        status: orderResult.rows[0].status,
      };
      if (!orders.details) {
        return result;
      }
      const details = await Promise.all(
        orders.details.map(async (element) => {
          const sqlInsertDetail =
            "INSERT INTO ORDER_DETAILS(order_id, product_id, quantity) VALUES ($1,$2,$3) RETURNING product_id,quantity";
          const detailsReturn = await conn.query(sqlInsertDetail, [
            result.id,
            element.productId,
            element.quantity,
          ]);
          return {
            productId: detailsReturn.rows[0].product_id,
            quantity: detailsReturn.rows[0].quantity,
          };
        }),
      );
      result.details = details;
      conn.release();
      return result;
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async update(orders: Orders): Promise<Orders> {
    if (!orders.id) {
      throw new Error(`id is require`);
    }
    const sql = "UPDATE ORDERS SET status = $1 WHERE id = $2 RETURNING *";
    // @ts-ignore
    const conn = await client.connect();
    try {
      await conn.query(sql, [orders.status, orders.id]);
      conn.release();
      const result = await this.getOrderById(orders.id);
      return result[0];
    } catch (err) {
      throw new Error(`Could not update order. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const deleteDetail = "DELETE FROM ORDER_DETAILS WHERE order_id=$1";
      const sql = "DELETE FROM ORDERS WHERE id=$1 ";
      // @ts-ignore
      const conn = await client.connect();
      await conn.query(deleteDetail, [id]);
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
