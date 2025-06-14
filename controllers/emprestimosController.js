// controllers/emprestimosController.js
import db from '../db/db.js';

// POST /emprestimos
export const realizarEmprestimo = (req, res) => {
  const { matricula, isbn } = req.body;

  if (!matricula || !isbn) {
    return res.status(400).send('Matrícula e ISBN são obrigatórios.');
  }

  const dataEmprestimo = new Date().toISOString().split('T')[0];
  const dataPrevista = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const query = `
    INSERT INTO emprestimos (matricula, isbn, dataEmprestimo, dataPrevista)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [matricula, isbn, dataEmprestimo, dataPrevista], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao registrar empréstimo.');
    }

    db.run(
      `UPDATE livros SET qtd = qtd - 1 WHERE isbn = ? AND qtd > 0`,
      [isbn],
      function (err2) {
        if (err2) {
          console.error(err2);
          return res.status(500).send('Empréstimo feito, mas erro ao atualizar quantidade do livro.');
        }

        if (this.changes === 0) {
          return res.status(400).send('Livro indisponível para empréstimo.');
        }

        res.status(200).send('Empréstimo realizado com sucesso!');
      }
    );
  });
};

// GET /emprestimos
export const listarEmprestimos = (req, res) => {
  db.all(`SELECT * FROM emprestimos`, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao listar empréstimos.');
    }

    res.json(rows);
  });
};

// POST /devolucoes
export const realizarDevolucao = (req, res) => {
  const { matricula, isbn } = req.body;

  if (!matricula || !isbn) {
    return res.status(400).send('Matrícula e ISBN são obrigatórios.');
  }

  const dataDevolucao = new Date().toISOString().split('T')[0];

  // Passo 1: Buscar o empréstimo mais recente ainda não devolvido
  db.get(
    `SELECT id FROM emprestimos
     WHERE matricula = ? AND isbn = ? AND dataDevolucao IS NULL
     ORDER BY dataEmprestimo DESC
     LIMIT 1`,
    [matricula, isbn],
    (err, emprestimo) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao buscar empréstimo.');
      }

      if (!emprestimo) {
        return res.status(404).send('Empréstimo não encontrado ou já devolvido.');
      }

      // Passo 2: Atualizar esse empréstimo
      db.run(
        `UPDATE emprestimos
         SET dataDevolucao = ?
         WHERE id = ?`,
        [dataDevolucao, emprestimo.id],
        function (err2) {
          if (err2) {
            console.error(err2);
            return res.status(500).send('Erro ao registrar devolução.');
          }

          // Passo 3: Atualizar quantidade do livro
          db.run(
            `UPDATE livros SET qtd = qtd + 1 WHERE isbn = ?`,
            [isbn],
            function (err3) {
              if (err3) {
                console.error(err3);
                return res.status(500).send('Devolução feita, mas erro ao atualizar quantidade do livro.');
              }

              res.status(200).send('Devolução registrada com sucesso.');
            }
          );
        }
      );
    }
  );
};
