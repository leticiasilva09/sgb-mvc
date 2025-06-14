import db from '../db/db.js';

export const getTodosUsuarios = (callback) => {
  db.all('SELECT * FROM usuarios', [], callback);
};

export const inserirUsuario = (usuario, callback) => {
  const { nome, matricula, curso } = usuario;
  db.run(`
    INSERT INTO usuarios (nome, matricula, curso)
    VALUES (?, ?, ?)
  `, [nome, matricula, curso], callback);
};

export const buscarUsuarioPorMatricula = (matricula, callback) => {
  db.get('SELECT matricula FROM usuarios WHERE matricula = ?', [matricula], callback);
};