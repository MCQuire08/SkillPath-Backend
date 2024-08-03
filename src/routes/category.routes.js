import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/category", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Error al recuperar categorias:", error);
    res.status(500).json({ error: "Error al recuperar categorias" });
  }
});

router.post("/category", async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = {
      name,
    };

    const category = await prisma.category.create({
      data: newCategory,
    });

    res.json(category);
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
});

export default router;
