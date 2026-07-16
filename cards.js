$(document).ready(function () {
    const $listaCards = $('#listaCards');

    // Verifica se estamos na página de exibição dos cards
    if ($listaCards.length > 0) {

        function carregarCards() {
            const alunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];

            $listaCards.empty();

            if (alunos.length === 0) {
                $listaCards.html('<div class="sem-alunos">Nenhum aluno cadastrado ainda.</div>');
                return;
            }

            // ATENÇÃO AQUI: O 'index' é obrigatório para o botão funcionar!
            alunos.forEach((aluno, index) => {
                const statusPagamentoHTML = aluno.pagou
                    ? '<span class="status-pago pago-sim">PAGO</span>'
                    : '<span class="status-pago pago-nao">PENDENTE</span>';

                let tiposValidos = [];
                if (aluno.avalFaixa) tiposValidos.push('<span class="badge-tipo">Faixa</span>');
                if (aluno.avalDistintivo) tiposValidos.push('<span class="badge-tipo">Distintivo</span>');
                const tiposHTML = tiposValidos.length > 0 ? tiposValidos.join(' ') : '<span class="badge-tipo">Não especificado</span>';

                const paletaFundo = {
                    "Branca": "#ffffff", "Amarela": "#fef9e7", "Laranja": "#fdf2e9", "Verde": "#e9f7ef"
                };
                const paletaBorda = {
                    "Branca": "#bdc3c7", "Amarela": "#f1c40f", "Laranja": "#e67e22", "Verde": "#27ae60"
                };

                const corFundo = paletaFundo[aluno.graduacaoAtual] || "#ffffff";
                const corBorda = paletaBorda[aluno.graduacaoAtual] || "#bdc3c7";

                const quadradosProgressoHTML = Array(8).fill(`
                        <div class="quadrado-maior">
                            <input type="checkbox" class="quadrante">
                            <input type="checkbox" class="quadrante">
                            <input type="checkbox" class="quadrante">
                            <input type="checkbox" class="quadrante">
                        </div>
                    `).join('');

                const imagemSrc = aluno.foto ? aluno.foto : "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

                // AQUI É ONDE O BOTÃO É DESENHADO NA TELA
                const cardHTML = `
                        <div class="card" style="background-color: ${corFundo}; border-left-color: ${corBorda};">
                            ${statusPagamentoHTML}
                            
                            <div class="card-cabecalho">
                                <img src="${imagemSrc}" class="foto-aluno" alt="Foto">
                                <div class="card-titulos">
                                    <h3>${aluno.nome} ${aluno.sobrenome}</h3>
                                    <span style="font-size: 13px; color: #7f8c8d;">Idade: ${aluno.idade} anos</span>
                                </div>
                                
                                <!-- OLHA O BOTÃO AQUI -->
                                <a href="index.html?edit=${index}" class="btn-editar">✏️ Editar</a>
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

                $listaCards.append(cardHTML);
            });
        }

        window.limparDados = function () {
            if (confirm("Tem certeza que deseja apagar todos os alunos cadastrados?")) {
                localStorage.removeItem('alunosPaKua');
                carregarCards();
            }
        }

        carregarCards();
    }
});