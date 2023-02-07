import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

// Routes
import authRouter from "./auth/user";
import apiRouter from "./api";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
