import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./src/modules/Users/routes/userRouter/userRouting.js";
import { adminRouter } from "./src/modules/Admin/router/adminRouter/adminRouter.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// new error handler

app.use((err, req, res, next) => {
  console.error(`Global Error: ${err.message}`);
  if (!res.headersSent) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } else {
    next(err);
  }
});


//============


async function main() {
  try {
    mongoose.connect(
      "mongodb+srv://developer:7swdYKubgF4RA07r@cluster0.mah1u.mongodb.net/zent?retryWrites=true&w=majority"
    );
    console.log("Connect");
  } catch (error) {
    console.log("Error :", error);
  }
}
main();

app.get("/", (req, res) => {
  res.json({ Message: "Welcome to API!" });
});
app.use("/api", userRouter);
app.use("/api", adminRouter);

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is Listening" + 3000);
  }
});

