import express from "express";
import authRouter from "./routes/auth";
import nunjucks from "nunjucks";
import mysql from "mysql";
import { errorHandler } from "./helpers/errorHandler";
const app = express();
const port = 3000;

export const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "nodechat",
});

mysqlConnection.connect();

nunjucks.configure("email-templates");

app.use(express.json());
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Chat app listening on port ${port}`);
});
