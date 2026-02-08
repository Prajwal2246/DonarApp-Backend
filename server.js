import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import registerDonorRoute from "./routes/registerDonorRoute.js";
import requestRoute from "./routes/requestRoute.js";

import cors from "cors";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://donar-app-frontend.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/donors", registerDonorRoute);
app.use("/api/request", requestRoute);

app.get("/", (req, res) => {
  try {
    res.send("hello");
  } catch (error) {
    console.log("errow with server", error);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
