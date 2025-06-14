// routes/livros.js
import express from 'express';
import { listarLivros, criarLivro } from '../controllers/livrosController.js';

const router = express.Router();

router.get('/', listarLivros);
router.post('/', criarLivro);

export default router;