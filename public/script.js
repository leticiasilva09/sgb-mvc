// URL base da API backend
const api = 'http://localhost:3000';

// definição das variáveis dos inputs
const livroTitulo = document.getElementById('livroTitulo');
const livroAutor = document.getElementById('livroAutor');
const livroISBN = document.getElementById('livroISBN');
const livroAno = document.getElementById('livroAno');
const livroQtd = document.getElementById('livroQtd');

const usuarioNome = document.getElementById('usuarioNome');
const usuarioMatricula = document.getElementById('usuarioMatricula');
const usuarioCurso = document.getElementById('usuarioCurso');

const matriculaEmprestimo = document.getElementById('matriculaEmprestimo');
const isbnEmprestimo = document.getElementById('isbnEmprestimo');

const matriculaDevolucao = document.getElementById('matriculaDevolucao');
const isbnDevolucao = document.getElementById('isbnDevolucao');

const saidaRelatorio = document.getElementById('saidaRelatorio');

const loginUsuario = document.getElementById('loginUsuario');
const loginSenha = document.getElementById('loginSenha');

// mostra a aba selecionada e oculta as demais
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

// formata uma data no formato brasileiro
function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

// exibe os detalhes do empréstimo na interface
function mostrarDetalhesEmprestimo(usuario, livro, dataEmprestimo, dataPrevista) {
  document.getElementById('nomeUsuarioEmprestimo').textContent = usuario;
  document.getElementById('tituloLivroEmprestimo').textContent = livro;
  document.getElementById('dataEmprestimo').textContent = formatarData(dataEmprestimo);
  document.getElementById('dataPrevistaEntrega').textContent = formatarData(dataPrevista);
  document.getElementById('detalhesEmprestimo').style.display = 'block';
}

// oculta a seção de detalhes do empréstimo
function ocultarDetalhesEmprestimo() {
  document.getElementById('detalhesEmprestimo').style.display = 'none';
}

// função cadastro de livro
async function cadastrarLivro(event) {

// impede recarregamento da página
  event.preventDefault();
  
// validação dos campos obrigatórios
  if (!livroTitulo.value || !livroAutor.value || !livroISBN.value || !livroAno.value || !livroQtd.value) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const ano = parseInt(livroAno.value);
  const qtd = parseInt(livroQtd.value);

// validação de ano e quantidade
  if (ano < 1000 || ano > new Date().getFullYear()) {
    alert('Por favor, insira um ano válido.');
    return;
  }

  if (qtd < 1) {
    alert('A quantidade deve ser maior que zero.');
    return;
  }

  const livro = {
    titulo: livroTitulo.value.trim(),
    autor: livroAutor.value.trim(),
    isbn: livroISBN.value.trim(),
    ano: ano,
    qtd: qtd,
  };

  try {
    const res = await fetch(`${api}/livros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro),
    });

    if (res.ok) {
      alert('Livro cadastrado com sucesso!');
      // limpa os campos
      livroTitulo.value = '';
      livroAutor.value = '';
      livroISBN.value = '';
      livroAno.value = '';
      livroQtd.value = '';
    } else {
      const errorMsg = await res.text();
      alert('Erro ao cadastrar livro: ' + errorMsg);
    }
  } catch (error) {
    alert('Erro de conexão ao cadastrar livro');
  }
}

// função cadastro de usuário
async function cadastrarUsuario(event) {

// impede recarregamento da página
  event.preventDefault();

  if (!usuarioNome.value || !usuarioMatricula.value || !usuarioCurso.value) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const usuario = {
    nome: usuarioNome.value.trim(),
    matricula: usuarioMatricula.value.trim(),
    curso: usuarioCurso.value.trim(),
  };

  try {
    const res = await fetch(`${api}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });

    if (res.ok) {
      alert('Usuário cadastrado com sucesso!');
      usuarioNome.value = '';
      usuarioMatricula.value = '';
      usuarioCurso.value = '';
    } else {
      const errorMsg = await res.text();
      alert('Erro ao cadastrar usuário: ' + errorMsg);
    }
  } catch (error) {
    alert('Erro de conexão ao cadastrar usuário');
  }
}

// função para fazer um empréstimo de livro
async function realizarEmprestimo(event) {

// impede recarregamento da página
  event.preventDefault();

  if (!matriculaEmprestimo.value || !isbnEmprestimo.value) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const emprestimo = {
    matricula: matriculaEmprestimo.value.trim(),
    isbn: isbnEmprestimo.value.trim(),
  };

  try {
    const res = await fetch(`${api}/emprestimos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emprestimo),
    });

    if (res.ok) {
      alert('Empréstimo realizado com sucesso!');
      
      // buscar detalhes para mostrar as datas
      await buscarDetalhesEmprestimo(emprestimo.matricula, emprestimo.isbn);
      
      matriculaEmprestimo.value = '';
      isbnEmprestimo.value = '';
    } else {
      const errorMsg = await res.text();
      alert('Erro ao realizar empréstimo: ' + errorMsg);
    }
  } catch (error) {
    alert('Erro de conexão ao realizar empréstimo');
  }
}

// função para procurar os detalhes do empréstimo
async function buscarDetalhesEmprestimo(matricula, isbn) {
  try {
    const [usuariosRes, livrosRes, emprestimosRes] = await Promise.all([
      fetch(`${api}/usuarios`),
      fetch(`${api}/livros`),
      fetch(`${api}/emprestimos`)
    ]);

    const usuarios = await usuariosRes.json();
    const livros = await livrosRes.json();
    const emprestimos = await emprestimosRes.json();

    const usuario = usuarios.find(u => u.matricula === matricula);
    const livro = livros.find(l => l.isbn === isbn);
    
    // busca o empréstimo mais recente ativo
    const emprestimo = emprestimos
      .filter(e => e.matricula === matricula && e.isbn === isbn && !e.dataDevolucao)
      .sort((a, b) => new Date(b.dataEmprestimo) - new Date(a.dataEmprestimo))[0];

    if (usuario && livro && emprestimo) {
      mostrarDetalhesEmprestimo(
        usuario.nome, 
        livro.titulo, 
        emprestimo.dataEmprestimo, 
        emprestimo.dataPrevista
      );
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do empréstimo:', error);
  }
}

// função para limpar e esconder os detalhes do empréstimo
function limparDetalhesEmprestimo() {
  const detalhes = document.getElementById('detalhesEmprestimo');
  detalhes.style.display = 'none';
  document.getElementById('nomeUsuarioEmprestimo').textContent = '';
  document.getElementById('tituloLivroEmprestimo').textContent = '';
  document.getElementById('dataEmprestimo').textContent = '';
  document.getElementById('dataPrevistaEntrega').textContent = '';
}

// função para fazer a devolução do livro
async function realizarDevolucao(event) {

// impede recarregamento da página
  event.preventDefault();

  if (!matriculaDevolucao.value || !isbnDevolucao.value) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const devolucao = {
    matricula: matriculaDevolucao.value.trim(),
    isbn: isbnDevolucao.value.trim(),
  };

  try {
    const res = await fetch(`${api}/devolucoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(devolucao),
    });

    if (res.ok) {
      alert('Livro devolvido com sucesso!');
      matriculaDevolucao.value = '';
      isbnDevolucao.value = '';
      limparDetalhesEmprestimo();
    } else {
      const errorMsg = await res.text();
      alert('Erro ao realizar devolução: ' + errorMsg);
    }
  } catch (error) {
    alert('Erro de conexão ao realizar devolução');
  }
}

// RELATÓRIOS
// função para mostrar os empréstimos ativos
async function listarEmprestados() {
  try {
    const [emprestimosRes, livrosRes, usuariosRes] = await Promise.all([
      fetch(`${api}/emprestimos`),
      fetch(`${api}/livros`),
      fetch(`${api}/usuarios`),
    ]);

    const emprestimos = await emprestimosRes.json();
    const livros = await livrosRes.json();
    const usuarios = await usuariosRes.json();

    const ativos = emprestimos.filter(e => !e.dataDevolucao);

    if (ativos.length === 0) {
      saidaRelatorio.textContent = 'Nenhum livro emprestado no momento.';
      return;
    }

    const saida = ativos.map(e => {
      const livro = livros.find(l => l.isbn === e.isbn);
      const usuario = usuarios.find(u => u.matricula === e.matricula);
      const dataEmprestimo = formatarData(e.dataEmprestimo);
      const dataPrevista = formatarData(e.dataPrevista);
      
      return `📚 ${livro?.titulo || 'Livro não encontrado'}\n` +
             `👤 ${usuario?.nome || 'Usuário não encontrado'} (${usuario?.matricula || 'N/A'})\n` +
             `📅 Emprestado em: ${dataEmprestimo}\n` +
             `⏰ Devolução prevista: ${dataPrevista}\n` +
             `${'-'.repeat(50)}`;
    }).join('\n\n');

    saidaRelatorio.textContent = saida;
  } catch (error) {
    saidaRelatorio.textContent = 'Erro ao carregar relatório de livros emprestados.';
  }
}

// função para listar os usuários em atraso
async function listarAtrasados() {
  try {
    const hoje = new Date();
    const [emprestimosRes, usuariosRes, livrosRes] = await Promise.all([
      fetch(`${api}/emprestimos`),
      fetch(`${api}/usuarios`),
      fetch(`${api}/livros`),
    ]);

    const emprestimos = await emprestimosRes.json();
    const usuarios = await usuariosRes.json();
    const livros = await livrosRes.json();

    const atrasados = emprestimos.filter(e =>
      !e.dataDevolucao && new Date(e.dataPrevista) < hoje
    );

    if (atrasados.length === 0) {
      saidaRelatorio.textContent = 'Nenhum usuário com atraso no momento.';
      return;
    }

    const saida = atrasados.map(e => {
      const usuario = usuarios.find(u => u.matricula === e.matricula);
      const livro = livros.find(l => l.isbn === e.isbn);
      const dataPrevista = formatarData(e.dataPrevista);
      const dataEmprestimo = formatarData(e.dataEmprestimo);
      const diasAtraso = Math.floor((hoje - new Date(e.dataPrevista)) / (1000 * 60 * 60 * 24));
      
      return `⚠️  USUÁRIO EM ATRASO\n` +
             `👤 ${usuario?.nome || 'Usuário não encontrado'} (${usuario?.matricula || 'N/A'})\n` +
             `📚 Livro: ${livro?.titulo || 'Livro não encontrado'}\n` +
             `📅 Data do empréstimo: ${dataEmprestimo}\n` +
             `📅 Deveria ter devolvido em: ${dataPrevista}\n` +
             `⏰ Dias em atraso: ${diasAtraso}\n` +
             `${'-'.repeat(50)}`;
    }).join('\n\n');

    saidaRelatorio.textContent = saida;
  } catch (error) {
    saidaRelatorio.textContent = 'Erro ao carregar relatório de usuários atrasados.';
  }
}

// função para listar os livros disponíveis
async function listarDisponiveis() {
  try {
    const res = await fetch(`${api}/livros`);
    const livros = await res.json();

    const disponiveis = livros.filter(l => l.qtd > 0);

    if (disponiveis.length === 0) {
      saidaRelatorio.textContent = 'Nenhum livro disponível no momento.';
      return;
    }

    const saida = disponiveis.map(l => 
      `📚 ${l.titulo}\n` +
      `✍️  Autor: ${l.autor}\n` +
      `📖 ISBN: ${l.isbn}\n` +
      `📅 Ano: ${l.ano}\n` +
      `📊 Quantidade disponível: ${l.qtd}\n` +
      `${'-'.repeat(50)}`
    ).join('\n\n');

    saidaRelatorio.textContent = saida;
  } catch (error) {
    saidaRelatorio.textContent = 'Erro ao carregar relatório de livros disponíveis.';
  }
}

showTab('livros');

  // limpa todos os campos de texto
 function limparCampos() {
  if (livroTitulo) livroTitulo.value = '';
  if (livroAutor) livroAutor.value = '';
  if (livroISBN) livroISBN.value = '';
  if (livroAno) livroAno.value = '';
  if (livroQtd) livroQtd.value = '';

  if (usuarioNome) usuarioNome.value = '';
  if (usuarioMatricula) usuarioMatricula.value = '';
  if (usuarioCurso) usuarioCurso.value = '';

  if (matriculaEmprestimo) matriculaEmprestimo.value = '';
  if (isbnEmprestimo) isbnEmprestimo.value = '';

  if (matriculaDevolucao) matriculaDevolucao.value = '';
  if (isbnDevolucao) isbnDevolucao.value = '';

  if (saidaRelatorio) saidaRelatorio.textContent = 'Selecione um relatório para visualizar...';
}

// permite a navegação com a tecla enter nas caixas de texto
document.querySelectorAll('input').forEach((input, index, inputs) => {
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = inputs[index + 1];
      if (next) {
        next.focus();
      }
    }
  });
});

loginSenha.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    fazerLogin();
  }
});

loginUsuario.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    loginSenha.focus();
  }
});