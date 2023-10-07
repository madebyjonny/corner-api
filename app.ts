import express from "express";
import { db } from "./data/db";
import auth from "./endpoints/auth";

const app = express();
const port = 8080;

app.use(express.json());

app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
