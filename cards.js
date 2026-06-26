const listaCards = document.getElementById('listaCards');
// Puxa os dados salvos. Se não achar nada, devolve uma lista vazia []
const alunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];
function carregarCards() {
    const alunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];
    listaCards.innerHTML = '';

    if (alunos.length === 0) {
        listaCards.innerHTML = '<div class="sem-alunos">Nenhum aluno cadastrado ainda.</div>';
        return;
    }

    alunos.forEach(aluno => {
        const statusPagamentoHTML = aluno.pagou
            ? '<span class="status-pago pago-sim">PAGO</span>'
            : '<span class="status-pago pago-nao">PENDENTE</span>';

        let tiposValidos = [];
        if (aluno.avalFaixa) tiposValidos.push('<span class="badge-tipo">Faixa</span>');
        if (aluno.avalDistintivo) tiposValidos.push('<span class="badge-tipo">Distintivo</span>');
        const tiposHTML = tiposValidos.length > 0 ? tiposValidos.join(' ') : '<span class="badge-tipo">Não especificado</span>';

        const cardHTML = `
                <div class="card">
                    ${statusPagamentoHTML}
                    <h3>${aluno.nome} ${aluno.sobrenome} <span style="font-size: 13px; font-weight: normal; color: #7f8c8d;">(${aluno.idade} anos)</span></h3>
                    <p><strong>Recinto:</strong> ${aluno.recinto}</p>
                    <p><strong>Orientador(a):</strong> ${aluno.orientador}</p>
                    <p><strong>Graduação Atual:</strong> ${aluno.graduacaoAtual} (${aluno.tempoFaixa})</p>
                    <p><strong>Avaliando para:</strong> ${aluno.faixaNova}</p>
                    <p style="margin-top: 10px;">${tiposHTML}</p>
                </div>
            `;

        listaCards.innerHTML += cardHTML;
    });
}

function limparDados() {
    if (confirm("Tem certeza que deseja apagar todos os alunos cadastrados?")) {
        localStorage.removeItem('alunosPaKua');
        carregarCards();
    }
}

carregarCards();

alunos.forEach(aluno => {
    // ... (cria o design do card com os dados do aluno atual) ...

    // Injeta o HTML criado dentro da página visual
    listaCards.innerHTML += cardHTML;
});