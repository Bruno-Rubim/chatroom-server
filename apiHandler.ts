import express from "express";

type User = {
  id: number;
  pos: { x: number; y: number };
  logged: boolean;
  lastPing: number;
};

let userList: User[] = [];

const apiHandler = express.Router();

apiHandler.get("/get-uidList", (req, res) => {
  res.status(200).json(userList);
});
apiHandler.use(express.json());

// Loging user
apiHandler.put("/login", (req, res) => {
  const user = req.body;
  const uid = Number(user.id);
  if (isNaN(uid)) {
    res.status(400);
    res.json({ message: "uid must be a number" });
    return;
  }
  user.lastPing = Date.now();
  userList.push(user);
  console.log(userList, "login");
  res.status(200);
  res.end();
});

// Updates game and register user ping
apiHandler.get("/gameUpdate/:uid", (req, res) => {
  const id = Number(req.params.uid);
  const user = userList.find((u) => u.id == id);
  if (!user) {
    res.status(500).statusMessage = "Could not find user with this id";
    res.end();
    return;
  }

  // Removes users that haven't requested in 1 second
  user.lastPing = Date.now();
  userList = userList.filter((u) => Date.now() - u.lastPing < 1000);
  console.log(
    userList.includes(userList.find((u) => Date.now() - u.lastPing >= 1000)!),
  );

  // TO-DO: Add the events

  res.status(200).json(userList);
});

type playerUpdate = {
  type: "movement";
  dir: "right" | "left" | "up" | "down";
  id: number;
};

// Recieving a user update
apiHandler.put("/playerUpdate", (req, res) => {
  const update: playerUpdate = req.body;
  const user = userList.find((u) => u.id == update.id);
  if (!user) {
    res.status(400);
    res.json({ message: "user not found" });
    return;
  }
  switch (update.dir) {
    case "left":
      user.pos.x -= 32;
      break;
    case "right":
      user.pos.x += 32;
      break;
    case "down":
      user.pos.y += 16;
      break;
    case "up":
      user.pos.y -= 16;
      break;
  }
  if (update.type) user.lastPing = Date.now();
  res.status(200);
  res.end();
});

export default apiHandler;
