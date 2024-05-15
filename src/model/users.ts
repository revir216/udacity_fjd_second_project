// @ts-ignore
import client from "../database/database";
import bcrypt from "bcrypt";

export type Users = {
  id?: number;
  username: string;
  firstname?: string;
  lastname?: string;
  password?: string;
};

export class UsersService {
  async index(): Promise<Users[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT id,username,firstName,lastname FROM USERS";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Users[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql =
        "SELECT id,username,firstname,lastname FROM USERS where id = ($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async getDetails(username: string): Promise<Users> {
    try {
      const sql =
        "SELECT username,firstname,lastname FROM USERS WHERE username=($1)";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [username]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${username}. Error: ${err}`);
    }
  }

  async create(users: Users): Promise<Users> {
    try {
      const sql =
        "INSERT INTO USERS (username,firstname, lastname, password) VALUES($1, $2, $3,$4) RETURNING id,username,firstname,lastname";
      // @ts-ignore
      const conn = await client.connect();
      const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;
      const hash = bcrypt.hashSync(
        users.password || "" + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS || ""),
      );
      const result = await conn.query(sql, [
        users.username,
        users.firstname,
        users.lastname,
        hash,
      ]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(
        `Could not add new user ${users.username}. Error: ${err}`,
      );
    }
  }

  async delete(id: string): Promise<Users> {
    try {
      const sql = "DELETE FROM USERS WHERE id=($1)";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  async update(user: Users): Promise<Users> {
    try {
      const sql =
        "UPDATE USERS SET firstname = $1, lastname = $2 WHERE username = $3 RETURNING username,firstname,lastname";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [
        user.firstname,
        user.lastname,
        user.username,
      ]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add new order ${name}. Error: ${err}`);
    }
  }

  async authenticate(
    username: string,
    password: string,
  ): Promise<Users | null> {
    // @ts-ignore
    const conn = await client.connect();
    const sql = "SELECT username,password FROM USERS WHERE username=($1)";
    const result = await conn.query(sql, [username]);
    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
    }
    return null;
  }

  async truncate(): Promise<void> {
    try {
      const sql = "TRUNCATE USERS RESTART IDENTITY CASCADE";
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(`Could not truncate order. Error: ${err}`);
    }
  }
}
