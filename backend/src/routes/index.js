import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { DespesaController } from '../controllers/DespesaController.js';
import { LimiteController } from '../controllers/LimiteController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = Router();

// Rotas públicas
router.get('/', (req, res) => {
  res.send('Espinafre, oba!');
});

// Rotas de usuário
router.post('/users', UsuarioController.register);
router.post('/login', UsuarioController.login);
router.post('/logout', UsuarioController.logout);

// Rotas protegidas
router.use(verifyJWT);

// Rotas de usuário protegidas
router.get('/users', UsuarioController.getProfile);

// Rotas de despesas
router.post('/despesas', DespesaController.create);
router.get('/despesas', DespesaController.list);
router.put('/despesas/:id', DespesaController.update);
router.delete('/despesas/:id', DespesaController.delete);
router.get('/total', DespesaController.getTotal);

// Rotas de limites
router.post('/limites', LimiteController.create);
router.get('/limites', LimiteController.list);
router.put('/limites/:id', LimiteController.update);
router.delete('/limites/:id', LimiteController.delete);

export default router; 