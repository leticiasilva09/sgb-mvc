import * as Livro from '../models/livro.js';

export const listarLivros = (req, res) => {
  Livro.getTodosLivros((err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
};

export const criarLivro = (req, res) => {
  const { titulo, autor, isbn, ano, qtd } = req.body;

  if (!titulo || !autor || !isbn || !ano || !qtd) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  Livro.buscarLivroPorISBN(isbn, (err, row) => {
    if (err) return res.status(500).send("Erro ao verificar ISBN");
    if (row) return res.status(400).send("Livro com este ISBN já existe");

    Livro.inserirLivro({ titulo, autor, isbn, ano, qtd }, (err) => {
      if (err) return res.status(500).send("Erro ao cadastrar livro");
      res.status(200).send("Livro cadastrado com sucesso");
    });
  });
};