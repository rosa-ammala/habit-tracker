import { prisma } from "../config/prisma";

export const getCategories = async (req: any, res: any) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching categories",
    });
  }
}

export const createCategory = async (req: any, res: any) => {
  try {
    const { name, icon } = req.body;

    if (!name || !icon) {
      return res.status(400).json({
        message: "Name and icon are required",
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        icon,
      },
    });

    res.json(category);
  } catch (err) {
    console.error(err);

    if ((err as any).code === "P2002") {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    res.status(500).json({
      message: "Error creating category",
    });
  }
}