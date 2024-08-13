import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/plan", async (_req, res) => {
  try {
    const plans = await prisma.plan.findMany();
    res.json(plans);
  } catch (error) {
    console.error("Error al recuperar los planes:", error);
    res.status(500).json({ error: "Error al recuperar planes" });
  }
});

router.get("/plan/getCoursesByUser/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    const plans = await prisma.plan.findMany({
      where: { userId },
      include: { course: true },
    });

    res.json(plans);
  } catch (error) {
    console.error("Error al recuperar los planes del usuario:", error);
    res.status(500).json({ error: "Error al recuperar planes del usuario" });
  }
});

router.put("/plan/updateProgress/:planId", async (req, res) => {
  try {
    const planId = parseInt(req.params.planId, 10);
    const { newProgress } = req.body;

    if (isNaN(planId) || newProgress === undefined) {
      return res.status(400).json({ error: "ID de plan o nuevo progreso no válido" });
    }

    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: { progress: newProgress },
    });

    res.json({
      success: true,
      message: "Progreso actualizado exitosamente",
      updatedPlan,
    });
  } catch (error) {
    console.error("Error al actualizar el progreso del plan:", error);
    res.status(500).json({ error: "Error al actualizar el progreso del plan" });
  }
});

router.post("/plan", async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    const newPlan = await prisma.plan.create({
      data: {
        courseId: parseInt(courseId, 10),
        userId: parseInt(userId, 10),
        progress: 0,
      },
    });

    res.json(newPlan);
  } catch (error) {
    console.error("Error al crear plan:", error);
    res.status(500).json({ error: "Error al crear plan" });
  }
});

router.get("/planEvidence/:idPlan", async (req, res) => {
  try {
    const { idPlan } = req.params;

    if (!idPlan) {
      return res.status(400).json({ error: "ID de plan no proporcionado" });
    }

    const planEvidences = await prisma.planEvidence.findMany({
      where: { planId: parseInt(idPlan, 10) },
      include: { evidence: true }, 
    });

    res.json(planEvidences);
  } catch (error) {
    console.error("Error al recuperar las evidencias:", error);
    res.status(500).json({ error: "Error al recuperar las evidencias" });
  }
});

router.post("/planEvidence", async (req, res) => {
  try {
    const { planId, link } = req.body;

    if (!planId || !link) {
      return res.status(400).json({ error: "ID del plan y enlace de la evidencia son requeridos" });
    }

    const newEvidence = await prisma.evidence.create({
      data: { link },
    });

    const newPlanEvidence = await prisma.planEvidence.create({
      data: {
        planId: parseInt(planId, 10),
        evidenceId: newEvidence.id,
      },
    });

    res.json({
      planEvidence: newPlanEvidence,
      evidence: newEvidence,
    });
  } catch (error) {
    console.error("Error al crear evidencia y asociarla con el plan:", error);
    res.status(500).json({ error: "Error al crear evidencia y asociarla con el plan" });
  }
});

export default router;
