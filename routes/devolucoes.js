// routes/devolucoes.js
import express from 'express';
import { realizarDevolucao } from '../controllers/emprestimosController.js';

const router = express.Router();

router.post('/', realizarDevolucao);

export default router;
