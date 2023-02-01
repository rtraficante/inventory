import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { auth, requiresAuth } from "express-openid-connect";

// Routes
import authRouter from "./auth/user";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged Out");
});

app.get("/profile", requiresAuth(), (req: Request, res: Response) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
