import express from "express";
import type { Request, Response } from "express";
import { db } from "../utils/db";

const router = express.Router();

router.post("/hook", async (req: Request, res: Response) => {
  const { email, secret } = req.body;
  console.log("yayaya", req.body);

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

router.post("/login", async (req: Request, res: Response) => {
  const { email } = JSON.parse(req.body);

  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

export default router;
