import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import {errorHandler} from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import {router} from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api", router);

// Error handler
app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    throw new Error("Error occurred: " + error);
  });
