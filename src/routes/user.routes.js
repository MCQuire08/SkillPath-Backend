import { Router } from "express";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/user/register", async (req, res) => {
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

router.get("/user/GetByUserName/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        userName: username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario por username:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener usuario por username" });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
      select: {
        userName: true,
      },
    });

    return res.json({ userName: user.userName });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    const { name, lastName, password, role, status, linkImage } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (lastName) updateData.lastName = lastName;
    if (password) updateData.password = await bcrypt.hash(password, 12);
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (linkImage) updateData.linkImage = linkImage;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    const response = {
      id: updatedUser.id,
      userName: updatedUser.userName,
    };

    return res.json(response);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

router.patch("/user/:id/changePassword", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "Nueva contraseña requerida" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    const response = {
      userName: updatedUser.userName,
    };

    return res.json(response);
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return res.status(500).json({ error: "Error al cambiar contraseña" });
  }
});

export default router;
