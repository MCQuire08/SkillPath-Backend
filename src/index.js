import express from 'express'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import categoryRoutes from './routes/category.routes.js'
import courseRoutes from './routes/course.routes.js';
import planRoutes from './routes/plan.routes.js'

const app = express()

app.use(express.json())

app.use('/api', categoryRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', planRoutes);

app.listen(3000)
console.log('Server on port' , 3000)