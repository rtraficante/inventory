import express from "express";
import type { Request, Response } from "express";
import { requiresAuth } from "express-openid-connect";

const router = express.Router();

router.get("/", requiresAuth(), async (req: Request, res: Response) => {
  
});
