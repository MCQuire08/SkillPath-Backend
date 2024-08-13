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
    const { name, description, duration, link, category } = req.body;

    const course = await prisma.course.create({
      data: {
        name,
        description,
        duration,
        link,
        category,
      },
    });

    const response = {
      course,
    };

    res.json(response);
  } catch (error) {
    console.error("Error al crear curso:", error);
    res.status(500).json({ error: "Error al crear curso" });
  }
});


router.get('/link', async (_req, res) => {
  try {
    const links = await prisma.link.findMany();
    res.json(links);
  } catch (error) {
    console.error('Error al recuperar los enlaces:', error);
    res.status(500).json({ error: 'Error al recuperar enlaces' });
  }
});


router.get("/link/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ error: "ID de curso no proporcionado" });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId, 10),
      },
      select: {
        link: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json({ link: course.link });
  } catch (error) {
    console.error("Error al recuperar el enlace del curso:", error);
    res.status(500).json({ error: "Error al recuperar el enlace del curso" });
  }
});

export default router;
