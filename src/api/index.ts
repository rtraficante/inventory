import express from "express";
import companyRouter from "./company";

const router = express.Router();

router.use("/company", companyRouter);

export default router;
