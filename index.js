const express = require("express");
const dotenv = require("dotenv");
const dbconnection = require("./dbconnection");
dotenv.config();

const userRouter = require("./routes/User");
const adminRouter = require("./routes/Admin");

const app = express();
const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGO_URI;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
dbconnection(MONGO_URI)
  .then(() => console.log("Mongodb connected"))
  .catch(() => console.log("Check URI"));

// routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
