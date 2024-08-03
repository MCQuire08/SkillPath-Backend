import { Router } from "express";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("user/register", async (req, res) => {
  try {
    const { name, lastName, password, role, status, linkImage } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const username = `${name
      .substring(0, 3)
      .toLowerCase()}${lastName.toLowerCase()}`;

    const newUser = {
      name,
      lastName,
      userName: username,
      password: hashedPassword,
      role,
      status,
      linkImage,
    };

    const createdUser = await prisma.user.create({
      data: newUser,
    });
    const response = {
      id: createdUser.id,
      userName: createdUser.userName,
    };

    res.json(response);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

router.get("/user", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get("/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    return res.status(500).json({ error: "Error al obtener usuario por ID" });
  }
});

export default router;
