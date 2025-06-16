# Sistema de Gestão de Biblioteca - Modelo MVC

## Equipe: Kaique do Vale e Leticia Carvalho - ADS S3

Esse é um sistema de biblioteca simples com:

- **Frontend**: HTML, CSS e JavaScript
- **Backend**: Node.js (usando Express)
- **Banco de Dados**: SQLite (arquivo `.db` local)

---

## Como abrir e rodar o projeto

### Requisitos:
- Ter o **Node.js** instalado no computador
- (Opcional) Ter o SQLite instalado (se quiser visualizar o banco separadamente)

---

### Passo a passo:

1. **Baixe o projeto do GitHub**

   - Clique em "Code" → "Download ZIP"
   - Extraia a pasta no seu computador

2. **Abra a pasta do projeto no VS Code**

3. **Abra o terminal no VS Code**
   - Vá em `Terminal → Novo Terminal`

4. **Instale as dependências**

   - No terminal, digite: **npm install** (aguarde um pouco e será instalado as dependências do node.js)

   - Depois, digite: **node server.js** (isso irá iniciar o servidor, abrindo um localhost)

   - Feito isso, vá na barra de pesquisa do Google e digite: **localhost:3000**

   - Se tudo der certo o sistema irá abrir

5. **Estrutura do Projeto**

```
/ sgb-mvc-main
│
├── server.js               # Arquivo principal do backend
├── limparDados.js          # Script para apagar todos os dados cadastrados no banco de dados (para facilitar testes)
├── meubanco.db             # Banco de dados SQLite
├── package.json            # Lista de dependências
├── package-lock.json       # Detalhes das versões instaladas
│
├── controllers/            # Lógica dos controllers (MVC)
│   ├── emprestimosController.js
│   ├── livrosController.js
│   └── usuariosController.js
│
├── db/                     # Conexão com o banco de dados
│   └── db.js
│
├── models/                 # Models (MVC)
│   ├── livro.js
│   └── usuario.js
│
├── public/                 # Frontend (essa pasta cumpre a função da pasta Views no sistema MVC)
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── routes/                 # Rotas da aplicação (MVC)
│   ├── devolucoes.js
│   ├── emprestimos.js
│   ├── livros.js
│   └── usuarios.js
```

  6. **Observações**
- A pasta node_modules não está incluída no repositório, pois o github não aceita por padrão. Mas ela será criada automaticamente no projeto ao rodar npm install.
- Já deixamos alguns dados cadastrados no banco de dados para facilitar (livros e um usuário).
- Se não tiver nenhum usuário atrasado é possível "simular" um atraso. Na linha 312 do arquivo `script.js` tem o seguinte código: `const hoje = new Date();`
  basta adicionar uma data de atraso no formato AAAA-MM-DD dentro dos parênteses vazios. **Ex:** `const hoje = new Date(2025-08-16);`. Feito isso basta salvar e recarregar
  o localhost, agora irá aparecer as informações mostrando o usuário em atraso.
