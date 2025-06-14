import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./meubanco.db');

db.serialize(() => {
  // tabela de usuários
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    matricula TEXT UNIQUE NOT NULL,
    curso TEXT NOT NULL
  )`);

  // tabela de livros
  db.run(`CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    ano INTEGER,
    qtd INTEGER NOT NULL
  )`);

  // tabela de empréstimos
  db.run(`CREATE TABLE IF NOT EXISTS emprestimos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT NOT NULL,
    isbn TEXT NOT NULL,
    dataEmprestimo TEXT NOT NULL,
    dataPrevista TEXT NOT NULL,
    dataDevolucao TEXT,
    FOREIGN KEY (matricula) REFERENCES usuarios(matricula),
    FOREIGN KEY (isbn) REFERENCES livros(isbn)
  )`);
});

export default db;