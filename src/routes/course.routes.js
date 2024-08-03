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

router.post("/courseLink", async (req, res) => {
  try {
    const { description, courseId } = req.body;

    if (!description || !courseId) {
      return res.status(400).json({ error: "Faltan datos necesarios" });
    }

    const link = await prisma.link.create({
      data: {
        description,
      },
    });

    const courseLink = await prisma.courseLink.create({
      data: {
        courseId: parseInt(courseId, 10),
        linkId: link.id,
      },
    });

    const response = {
      link,
      courseLink,
    };

    res.json(response);
  } catch (error) {
    console.error("Error al crear y asociar enlace:", error);
    res.status(500).json({ error: "Error al crear y asociar enlace" });
  }
});

router.get('/courseLink', async (_req,res) => {
  try{
      const links = await prisma.link.findMany();
      res.json(links);
  }catch (error){
      console.error('Error al recuperar los links:', error);
  res.status(500).json({ error: 'Error al recuperar links' });
  }
});

router.get("/courseLink/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ error: "ID de curso no proporcionado" });
    }

    const courseLinks = await prisma.courseLink.findMany({
      where: {
        courseId: parseInt(courseId, 10),
      },
      include: {
        link: true,
      },
    });

    res.json(courseLinks);
  } catch (error) {
    console.error("Error al recuperar los enlaces del curso:", error);
    res.status(500).json({ error: "Error al recuperar enlaces del curso" });
  }
});

export default router;
