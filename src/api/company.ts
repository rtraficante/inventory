import express from "express";
import type { Request, Response } from "express";
import { db } from "../utils/db";
// import { requiresAuth } from "express-openid-connect";
// import { db } from "src/utils/db";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const user = await db.user.findFirst({
      where: {
        email: req.oidc.user?.email,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "Access Denied" });
    }

    const company = await db.company.create({
      data: {
        name,
      },
    });

    await db.companyMembers.create({
      data: {
        role: "Admin",
        userId: user.id,
        companyId: company.id,
      },
    });

    return res.status(201).json(company);
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
});

export default router;
