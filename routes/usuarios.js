// routes/usuarios.js
import express from 'express';
import { listarUsuarios, criarUsuario } from '../controllers/usuariosController.js';

const router = express.Router();

router.get('/', listarUsuarios);
router.post('/', criarUsuario);

export default router;