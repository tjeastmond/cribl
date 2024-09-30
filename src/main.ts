import express from "express";
import router from "@routes/router";
import middleware from "@middleware/connect";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(middleware(app));
app.use(router(app));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
