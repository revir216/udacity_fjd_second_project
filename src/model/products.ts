// @ts-ignore
import client from "../database/database";

export type Products = {
  id?: number;
  name?: string;
  price?: number;
  category?: string;
};

export class ProductsService {
  async index(): Promise<Products[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT * FROM PRODUCTS";

      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Products> {
    try {
      const sql = "SELECT * FROM PRODUCTS WHERE id=($1)";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(products: Products): Promise<Products> {
    try {
      const sql =
        "INSERT INTO PRODUCTS (name, price, category) VALUES($1, $2, $3) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [
        products.name,
        products.price,
        products.category,
      ]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not add new product ${name}. Error: ${err}`);
    }
  }

  async update(product: Products): Promise<Products> {
    try {
      const sql =
        "UPDATE PRODUCTS SET name = $1, price = $2, category =$3 WHERE id = $4 RETURNING *";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category,
        product.id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add new product . Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Products> {
    try {
      const sql = "DELETE FROM PRODUCTS WHERE id=($1)";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }

  async truncate(): Promise<void> {
    try {
      const sql = "TRUNCATE PRODUCTS RESTART IDENTITY CASCADE";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(`Could not truncate product. Error: ${err}`);
    }
  }
}
