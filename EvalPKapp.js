const form = document.getElementById('formCadastro');
const listaCards = document.getElementById('listaCards');

form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    // Captura dos dados básicos
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const idade = document.getElementById('idade').value;
    const orientador = document.getElementById('orientador').value;
    const recinto = document.getElementById('recinto').value;
    const graduacaoAtual = document.getElementById('graduacaoAtual').value;
    const tempoFaixa = document.getElementById('tempoFaixa').value;
    const faixaNova = document.getElementById('faixaNova').value;

    // Lógica dos Checkboxes
    const pagou = document.getElementById('pagou').checked;
    const avalFaixa = document.getElementById('avalFaixa').checked;
    const avalDistintivo = document.getElementById('avalDistintivo').checked;

    // Formatação do status de pagamento
    const statusPagamentoHTML = pagou
        ? '<span class="status-pago pago-sim">PAGO</span>'
        : '<span class="status-pago pago-nao">PENDENTE</span>';

    // Identificação dos tipos selecionados
    let tiposValidos = [];
    if (avalFaixa) tiposValidos.push('<span class="badge-tipo">Faixa</span>');
    if (avalDistintivo) tiposValidos.push('<span class="badge-tipo">Distintivo</span>');
    const tiposHTML = tiposValidos.length > 0 ? tiposValidos.join(' ') : '<span class="badge-tipo">Não especificado</span>';

    // Criação do Card
    const cardHTML = `
            <div class="card">
                ${statusPagamentoHTML}
                <h3>${nome} ${sobrenome} <span style="font-size: 13px; font-weight: normal; color: #7f8c8d;">(${idade} anos)</span></h3>
                <p><strong>Recinto:</strong> ${recinto}</p>
                <p><strong>Orientador(a):</strong> ${orientador}</p>
                <p><strong>Graduação Atual:</strong> ${graduacaoAtual} (${tempoFaixa})</p>
                <p><strong>Avaliando para:</strong> ${faixaNova}</p>
                <p style="margin-top: 10px;">${tiposHTML}</p>
            </div>
        `;

    // Adiciona à tela
    listaCards.innerHTML += cardHTML;

    // Limpa o formulário
    form.reset();
    // Garante que o checkbox padrão volte marcado se preferir
    document.getElementById('avalFaixa').checked = true;
});