import express from "express";
import type { Request, Response } from "express";
import { db } from "../utils/db";

const router = express.Router();

router.post("/hook", async (req: Request, res: Response) => {
  const { email, secret } = req.body;

  if (secret !== process.env.AUTH0_HOOK_SECRET) {
    res.status(403).json({ message: "You must provide the secret" });
  }

  try {
    const user = await db.user.create({
      data: {
        email,
      },
    });

    res.status(201).json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

export default router;
