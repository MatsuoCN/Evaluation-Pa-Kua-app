// ==========================================
// LÓGICA DA PÁGINA DE CARDS (cards.html)
// ==========================================
const listaCards = document.getElementById('listaCards');

// O "if" garante que este código só rode na página dos cards
if (listaCards) {
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

            // 1. AQUI ESTÁ A LÓGICA DE CORES DAS FAIXAS
            const paletaFundo = {
                "Branca": "#ffffff",
                "Amarela": "#ffe78e",
                "Laranja": "#ffbd87",
                "Verde": "#abffcf",
                "Cinza": "#cdcdcd",
                "Azul": "#869eff",
                "Vermelha": "#ff7b7b",
                "I Grau": "#000000",
                "II Grau": "#000000",
                "III Grau": "#000000",

            };

            const paletaBorda = {
                "Branca": "#ffffff",
                "Amarela": "#ffdc17",
                "Laranja": "#f47c12",
                "Verde": "#27ae60",
                "Cinza": "#9a9a9a",
                "Azul": "#0f3fff",
                "Vermelha": "#ff2121",
                "I Grau": "#c59206",
                "II Grau": "#c59206",
                "III Grau": "#c59206",

            };

            const corFundo = paletaFundo[aluno.graduacaoAtual] || "#ffffff";
            const corBorda = paletaBorda[aluno.graduacaoAtual] || "#bdc3c7";

            // 2. AQUI ESTÁ A LÓGICA DOS QUADRANTES JUNTOS NO MESMO LUGAR
            const quadradosProgressoHTML = Array(8).fill(`
                <div class="quadrado-maior">
                    <input type="checkbox" class="quadrante">
                    <input type="checkbox" class="quadrante">
                    <input type="checkbox" class="quadrante">
                    <input type="checkbox" class="quadrante">
                </div>
            `).join('');

            // 3. AQUI ESTÁ A FOTO DO ALUNO
            const imagemSrc = aluno.foto ? aluno.foto : "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

            // 4. A MONTAGEM DO CARD COM TUDO INCLUSO
            // Note que o style injeta a corFundo e corBorda na primeira linha
            const cardHTML = `
                <div class="card" style="background-color: ${corFundo}; border-left-color: ${corBorda};">
                    ${statusPagamentoHTML}
                    
                    <div class="card-cabecalho">
                        <img src="${imagemSrc}" class="foto-aluno" alt="Foto">
                        <div class="card-titulos">
                            <h3>${aluno.nome} ${aluno.sobrenome}</h3>
                            <span style="font-size: 13px; color: #7f8c8d;">Idade: ${aluno.idade} anos</span>
                        </div>
                    </div>
                    
                    <p><strong>Recinto:</strong> ${aluno.recinto}</p>
                    <p><strong>Orientador(a):</strong> ${aluno.orientador}</p>
                    <p><strong>Graduação Atual:</strong> ${aluno.graduacaoAtual} (${aluno.tempoFaixa})</p>
                    <p><strong>Avaliando para:</strong> ${aluno.faixaNova}</p>
                    <p style="margin-top: 10px;">${tiposHTML}</p>
                    
                    <div class="area-quadrantes">
                        ${quadradosProgressoHTML}
                    </div>
                </div>
            `;

            listaCards.innerHTML += cardHTML;
        });
    }

    // Função global para limpar os dados
    window.limparDados = function () {
        if (confirm("Tem certeza que deseja apagar todos os alunos cadastrados?")) {
            localStorage.removeItem('alunosPaKua');
            carregarCards();
        }
    }

    // Roda a função principal
    carregarCards();
}