import express from 'express'

import productsRoutes from './routes/products.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

const app = express()

app.use(express.json())

app.use('/api', productsRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes)

app.listen(3000)
console.log('Server on port' , 3000)