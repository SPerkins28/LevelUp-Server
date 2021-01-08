require("dotenv").config();
const express = require("express");
const db = require("./db");
const app = express();

const controller = require("./controllers");

app.use(express.json());

app.use(require("./middleware/headers"));
app.use("/user", controller.usercontroller);
app.use("/review", controller.reviewcontroller);
app.use("/wanttoplay", controller.wanttoplaycontroller);
app.use("/library", controller.librarycontroller);

db.authenticate()
  .then(() => db.sync())
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`[Server: ] App is listening on Port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.log("[Server:] Server Crashed");
    console.log(err);
  });
