import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/course", async (_req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    console.error("Error al recuperar los cursos:", error);
    res.status(500).json({ error: "Error al recuperar cursos" });
  }
});

router.post("/course", async (req, res) => {
  try {
    const { name, description, duration, categoryId } = req.body;

    const course = await prisma.course.create({
      data: {
        name,
        description,
        duration,
      },
    });

    if (categoryId) {
      await prisma.courseCategory.create({
        data: {
          courseId: course.id,
          categoryId,
        },
      });
    }

    const response = {
      course,
      categoryId: categoryId || null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error al crear curso:", error);
    res.status(500).json({ error: "Error al crear curso" });
  }
});
export default router;
