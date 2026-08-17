import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../middleware/asyncHandler";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(categories);
  },
  "Error fetching categories"
);
