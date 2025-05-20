const form = document.getElementById("formAluno");
const tabela = document.querySelector("#tabelaAlunos tbody");
const toggleFormBtn = document.getElementById("toggleForm");
const matriculaInput = document.getElementById("matricula");

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
let graficoPlanos;

// Gera matrícula automaticamente
function gerarMatricula() {
  const maior = alunos.reduce((max, aluno) => {
    const num = parseInt(aluno.matricula);
    return isNaN(num) ? max : Math.max(max, num);
  }, 1000);
  return (maior + 1).toString();
}

function salvarAlunos() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

function atualizarEstatisticas() {
  document.getElementById("totalAlunos").textContent = alunos.length;
  const planos = [...new Set(alunos.map(aluno => aluno.plano))];
  document.getElementById("planosUnicos").textContent = planos.length;
}

function atualizarGraficoPlanos() {
  const contagemPlanos = {};
  alunos.forEach(aluno => {
    contagemPlanos[aluno.plano] = (contagemPlanos[aluno.plano] || 0) + 1;
  });

  const labels = Object.keys(contagemPlanos);
  const dados = Object.values(contagemPlanos);
  const cores = ['#3498db', '#e67e22', '#2ecc71', '#9b59b6', '#f1c40f'];

  const config = {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Distribuição de Planos',
        data: dados,
        backgroundColor: cores.slice(0, labels.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  };

  if (graficoPlanos) graficoPlanos.destroy();

  const ctx = document.getElementById('graficoPlanos').getContext('2d');
  graficoPlanos = new Chart(ctx, config);
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
        <button class="acao editar" onclick="editarAluno(${index})">Editar</button>
        <button class="acao excluir" onclick="removerAluno(${index})">Excluir</button>
      </td>
    `;
  });

  atualizarEstatisticas();
  atualizarGraficoPlanos();
  matriculaInput.value = gerarMatricula(); // Atualiza matrícula automática
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value;
  const plano = document.getElementById("plano").value.trim();
  const matricula = document.getElementById("matricula").value.trim();

  if (!nome || !idade || !plano) {
    alert("Preencha todos os campos.");
    return;
  }

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

  alunos.splice(index, 1); // Remove temporariamente
  salvarAlunos();
  renderizarTabela();
}

function removerAluno(index) {
  if (confirm("Tem certeza que deseja excluir este aluno?")) {
    alunos.splice(index, 1);
    salvarAlunos();
    renderizarTabela();
  }
}

// Oculta ou mostra o formulário de cadastro
toggleFormBtn.addEventListener("click", () => {
  form.classList.toggle("oculto");
  const visivel = !form.classList.contains("oculto");
  toggleFormBtn.textContent = visivel ? "Ocultar Cadastro" : "Mostrar Cadastro";
});

// Inicializa tudo
renderizarTabela();
