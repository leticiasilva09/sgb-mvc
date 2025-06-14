import db from './db/db.js';

db.serialize(() => {
  console.log('Apagando dados...');

  db.run('DELETE FROM emprestimos', (err) => {
    if (err) return console.error('Erro ao limpar emprestimos:', err.message);
    console.log('Dados da tabela "emprestimos" apagados com sucesso.');
  });

  db.run('DELETE FROM livros', (err) => {
    if (err) return console.error('Erro ao limpar livros:', err.message);
    console.log('Dados da tabela "livros" apagados com sucesso.');
  });

  db.run('DELETE FROM usuarios', (err) => {
    if (err) return console.error('Erro ao limpar usuarios:', err.message);
    console.log('Dados da tabela "usuarios" apagados com sucesso.');
  });
});

db.close((err) => {
  if (err) return console.error('Erro ao fechar o banco:', err.message);
  console.log('Conexão com o banco de dados encerrada.');
});
