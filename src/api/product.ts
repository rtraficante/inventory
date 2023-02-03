import express from "express";
import type { Request, Response } from "express";
import { requiresAuth } from "express-openid-connect";
import { db } from "../utils/db";

const router = express.Router();

router.get("/", requiresAuth(), async (req: Request, res: Response) => {
  try {
    const user = await db.user.findFirst({
      where: {
        email: req.oidc.user?.email,
      },
      include: {
        company: {
          select: {
            companyId: true,
          },
        },
      },
    });

    if (!user) return res.status(403).json({ message: "User not authorized" });

    const products = await db.product.findMany({
      where: {
        companyId: user?.company[0].companyId,
      },
    });

    return res.status(200).json(products);
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
});
