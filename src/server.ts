import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/v1/api", routes);
app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

export default app;
