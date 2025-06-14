import db from '../db/db.js';

export const getTodosLivros = (callback) => {
  db.all('SELECT * FROM livros', [], callback);
};

export const inserirLivro = (livro, callback) => {
  const { titulo, autor, isbn, ano, qtd } = livro;
  db.run(`
    INSERT INTO livros (titulo, autor, isbn, ano, qtd)
    VALUES (?, ?, ?, ?, ?)
  `, [titulo, autor, isbn, ano, qtd], callback);
};

export const buscarLivroPorISBN = (isbn, callback) => {
  db.get('SELECT isbn FROM livros WHERE isbn = ?', [isbn], callback);
};