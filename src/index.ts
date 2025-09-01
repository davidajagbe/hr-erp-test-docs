import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import {generateOpenApiDoc}  from './openapi/registry.ts';
import swaggerUi from 'swagger-ui-express';
import router from './routes/userRoutes.ts';
import guarantorRouter from './guarantor/guarantor.routes.ts';
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourDB';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve OpenAPI JSON for Swagger UI
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(generateOpenApiDoc());
});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/api-docs/swagger.json' }));

app.use('/api/users', router);
app.use('/guarontos', guarantorRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));