import { Router } from 'express';
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
  
        const user = await prisma.user.findUnique({
            where: {
                userName: username
            }
        });
  
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
  
        const token = jwt.sign({ userId: user.id }, 'fbf3efde675baf89d76b8f0a7bbbc18a27e259f30b7991586f9f96f897fee26a', { expiresIn: '1h' });
  
        return res.json({
            message: 'Inicio de sesión exitoso',
            token: token,
            id: user.id
        });
    } catch (error) {
        console.error('Error al realizar el inicio de sesión:', error);
        return res.status(500).json({ error: 'Error al realizar el inicio de sesión' });
    }
});

export default router;
