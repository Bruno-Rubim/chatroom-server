import express from "express";
import cors from "cors";

// Not sure
const app = express();

const apiHandler = express.Router();

let uidList: number[] = [];

apiHandler.get("/get-uidList", (req, res) => {
  res.status(200).json(uidList);
});
apiHandler.use(express.json());
apiHandler.put("/store-uid", (req, res) => {
  const uid = Number(req.body);
  if (uid == null) {
    res.status(400);
    res.json({ message: "uid must be a number" });
    return;
  }
  uidList.push(req.body);
  console.log(uidList);
  res.status(200);
  res.end();
});

app.use(cors());
app.use(apiHandler);

app.listen(8080, () => {
  console.log("Server running!");
});
