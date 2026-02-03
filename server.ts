import express from "express";
import cors from "cors";
import apiHandler from "./apiHandler.ts";

// Not sure
const app = express();

app.use(cors());
app.use(apiHandler);

app.listen(8080, () => {
  console.log("Server running!");
});
