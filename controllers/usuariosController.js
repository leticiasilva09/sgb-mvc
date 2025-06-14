import * as Usuario from '../models/usuario.js';

export const listarUsuarios = (req, res) => {
  Usuario.getTodosUsuarios((err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
};

export const criarUsuario = (req, res) => {
  const { nome, matricula, curso } = req.body;

  if (!nome || !matricula || !curso) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  Usuario.buscarUsuarioPorMatricula(matricula, (err, row) => {
    if (err) return res.status(500).send("Erro ao verificar matrícula");
    if (row) return res.status(400).send("Usuário com esta matrícula já existe");

    Usuario.inserirUsuario({ nome, matricula, curso }, (err) => {
      if (err) return res.status(500).send("Erro ao cadastrar usuário");
      res.status(200).send("Usuário cadastrado com sucesso");
    });
  });
};