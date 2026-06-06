const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const swaggerSpec = require('./config/swagger');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
