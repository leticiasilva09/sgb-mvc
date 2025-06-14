// routes/emprestimos.js
import express from 'express';
import { realizarEmprestimo, listarEmprestimos, realizarDevolucao } from '../controllers/emprestimosController.js';

const router = express.Router();

router.post('/', realizarEmprestimo);
router.get('/', listarEmprestimos);
router.post('/devolucoes', realizarDevolucao);

export default router;
