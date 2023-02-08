import express from "express";
import type { Request, Response } from "express";
import { db } from "../utils/db";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const userEmail = req.headers.userEmail as string;
    const user = await db.user.findFirst({
      where: {
        email: userEmail,
      },
      include: {
        company: {},
      },
    });

    if (!user) {
      return res.status(403).json({ message: "User Authentication error" });
    }

    const companies = await db.company.findMany({
      where: {
        User: {
          some: {
            userId: user.id,
          },
        },
      },
    });
    return res.status(200).json(companies);
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const company = await db.company.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    return res.status(200).json(company);
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const userEmail = req.headers.userEmail as string;
    const user = await db.user.findFirst({
      where: {
        email: userEmail,
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
