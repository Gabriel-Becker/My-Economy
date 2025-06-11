const { Router } = require('express');
const UserController = require('./controllers/UserController');
const ExpenseController = require('./controllers/ExpenseController');
const MonthlyLimitController = require('./controllers/MonthlyLimitController');
const authMiddleware = require('./middlewares/auth');
const validateDate = require('./middlewares/dateValidation');
const validateMonthlyLimit = require('./middlewares/limitValidation');

const routes = Router();

// Rotas públicas
routes.post('/users', UserController.store);
routes.post('/sessions', UserController.signin);

// Middleware de autenticação
routes.use(authMiddleware);

// Rotas privadas
routes.get('/users', UserController.show);

// Rotas de despesas
routes.post('/expenses', validateDate, ExpenseController.store);
routes.get('/expenses', ExpenseController.index);
routes.put('/expenses/:id', validateDate, ExpenseController.update);
routes.delete('/expenses/:id', ExpenseController.delete);

// Rotas de limites
routes.post('/limits', validateDate, validateMonthlyLimit, MonthlyLimitController.store);
routes.get('/limits', MonthlyLimitController.index);
routes.put('/limits/:id', validateDate, MonthlyLimitController.update);
routes.delete('/limits/:id', MonthlyLimitController.delete);

module.exports = routes; 