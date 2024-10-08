import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import planRoutes from './routes/plan.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', planRoutes);

app.listen(3000, () => {
  console.log('Server on port', 3000);
});
