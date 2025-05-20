const form = document.getElementById("formAluno");
const tabela = document.querySelector("#tabelaAlunos tbody");

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

function salvarAlunos() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

function renderizarTabela() {
  tabela.innerHTML = "";
  alunos.forEach((aluno, index) => {
    const row = tabela.insertRow();

    row.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.plano}</td>
      <td>${aluno.matricula}</td>
      <td>
        <button onclick="editarAluno(${index})">Editar</button>
        <button onclick="removerAluno(${index})">Excluir</button>
      </td>
    `;
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  const plano = document.getElementById("plano").value;
  const matricula = document.getElementById("matricula").value;

  alunos.push({ nome, idade, plano, matricula });
  salvarAlunos();
  renderizarTabela();
  form.reset();
});

function editarAluno(index) {
  const aluno = alunos[index];
  document.getElementById("nome").value = aluno.nome;
  document.getElementById("idade").value = aluno.idade;
  document.getElementById("plano").value = aluno.plano;
  document.getElementById("matricula").value = aluno.matricula;

  alunos.splice(index, 1); // Remove e depois regrava no submit
}

function removerAluno(index) {
  if (confirm("Tem certeza que deseja excluir este aluno?")) {
    alunos.splice(index, 1);
    salvarAlunos();
    renderizarTabela();
  }
}

renderizarTabela();
