import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import livrosRoutes from './routes/livros.js';
import usuariosRoutes from './routes/usuarios.js';
import emprestimosRoutes from './routes/emprestimos.js';
import devolucoesRoutes from './routes/devolucoes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota inicial (página HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas da API
app.use('/livros', livrosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/emprestimos', emprestimosRoutes);
app.use('/devolucoes', devolucoesRoutes);

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});