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
         // Para cada aluno, desenha o card na tela
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

                // AQUI ESTÁ O DESENHO DO CARD COM O TELEFONE INCLUÍDO
                const cardHTML = `
                        <div class="card" style="background-color: ${corFundo}; border-left-color: ${corBorda};">
                            
                            <div class="card-cabecalho">
                                <img src="${imagemSrc}" class="foto-aluno" alt="Foto">
                                <div class="card-titulos">
                                    <h3>${aluno.nome} ${aluno.sobrenome}</h3>
                                    <span style="font-size: 13px; color: #7f8c8d;">Idade: ${aluno.idade} anos</span>
                                </div>
                                
                                <div class="acoes-card" style="margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 15px;">
                                    ${statusPagamentoHTML}
                                    <a href="index.html?edit=${index}" class="btn-editar" style="margin-left: 0;">✏️ Editar</a>
                                </div>
                            </div>
                            
                            <!-- A LINHA DO TELEFONE APARECE AQUI! -->
                            <p style="margin-top: 5px;"><strong>WhatsApp:</strong> ${aluno.telefone ? aluno.telefone : 'Não preenchido'}</p>
                            
                            <p><strong>Recinto:</strong> ${aluno.recinto}</p>
                            <p><strong>Orientador:</strong> ${aluno.orientador}</p>
                            <p><strong>Graduação Atual:</strong> ${aluno.graduacaoAtual} (${aluno.tempoFaixa})</p>
                            <p><strong>Avaliando para:</strong> ${aluno.faixaNova}</p>
                            <p style="margin-top: 10px;">${tiposHTML}</p>
                            
                            <div class="area-quadrantes">
                                ${quadradosProgressoHTML}
                            </div>
                        </div>
                    `;

                $('#listaCards').append(cardHTML);
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

    // ==========================================
    // LÓGICA PARA GERAR O PDF
    // ==========================================
    $('#btnGerarPDF').on('click', function() {
    const elementoOrigem = document.getElementById('listaCards');
    const modalidade = localStorage.getItem('modalidadeEscolhida') || 'Pa-Kua';

    // 1. Criar o Título (canto superior esquerdo, fonte menor)
    const tituloPDF = document.createElement('h2');
    tituloPDF.innerText = `Avaliação - ${modalidade}`;
    tituloPDF.style.textAlign = 'left'; // Canto esquerdo
    tituloPDF.style.fontSize = '14px';  // Tamanho menor
    tituloPDF.style.color = '#333';
    tituloPDF.style.marginBottom = '15px';
    tituloPDF.style.fontWeight = 'bold';

    // 2. Preparar os cards para 3 colunas usando Flexbox
    // Salva os estilos originais para podermos desfazer depois sem recarregar a página
    const displayOriginal = elementoOrigem.style.display;
    const flexWrapOriginal = elementoOrigem.style.flexWrap;
    const gapOriginal = elementoOrigem.style.gap;

    // Aplica o formato perfeito de 3 colunas para o PDF
    elementoOrigem.style.display = 'flex';
    elementoOrigem.style.flexWrap = 'wrap';
    elementoOrigem.style.gap = '2%'; // Distância exata para caberem 3 itens

    const cards = Array.from(elementoOrigem.children);
    const estilosOriginaisCards = [];
    const quebrasDePagina = [];

    cards.forEach((card, index) => {
        // Salva a largura original do card
        estilosOriginaisCards.push(card.style.cssText);

        // Força o card a ocupar quase 1/3 do espaço (32% + margem de segurança)
        card.style.width = '32%'; 
        card.style.pageBreakInside = 'avoid'; // Evita que o card seja cortado no meio
        card.style.marginBottom = '15px';

        // MÁGICA DO LIMITE: A cada 9 cards, inserimos um "cortador" de página
        if ((index + 1) % 9 === 0 && index !== cards.length - 1) {
            const breakElement = document.createElement('div');
            breakElement.classList.add('html2pdf__page-break'); // Classe nativa do html2pdf
            breakElement.style.width = '100%'; // Ocupa a linha toda para forçar a quebra
            breakElement.style.height = '0';
            breakElement.style.margin = '0';
            
            // Insere a quebra invisível logo após o 9º, 18º, 27º card...
            card.parentNode.insertBefore(breakElement, card.nextSibling);
            quebrasDePagina.push(breakElement);
        }
    });

    // 3. Criar uma "caixa" invisível para agrupar o título e a lista de cards
    const wrapperPDF = document.createElement('div');
    elementoOrigem.parentNode.insertBefore(wrapperPDF, elementoOrigem);
    wrapperPDF.appendChild(tituloPDF);
    wrapperPDF.appendChild(elementoOrigem);

    // Configurações do PDF
    const nomeArquivo = `Avaliacoes_${modalidade.replace(/\s+/g, '_')}.pdf`;
    const opcoesPDF = {
        margin:       10, 
        filename:     nomeArquivo, 
        image:        { type: 'jpeg', quality: 0.98 }, 
        html2canvas:  { scale: 2, useCORS: true }, 
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' } 
    };

    const $botao = $(this);
    const textoOriginal = $botao.text();
    $botao.text('⏳ Gerando PDF...').prop('disabled', true);

    // 4. Gerar o PDF e Limpar o Código em seguida
    html2pdf().set(opcoesPDF).from(wrapperPDF).save().then(function() {
        $botao.text(textoOriginal).prop('disabled', false);
        
        // Desfazer o Wrapper (devolve a lista para o pai original e remove o título)
        wrapperPDF.parentNode.insertBefore(elementoOrigem, wrapperPDF);
        wrapperPDF.remove();

        // Restaurar estilos originais do container dos cards
        elementoOrigem.style.display = displayOriginal;
        elementoOrigem.style.flexWrap = flexWrapOriginal;
        elementoOrigem.style.gap = gapOriginal;

        // Restaurar estilos originais de cada card individual
        cards.forEach((card, index) => {
            card.style.cssText = estilosOriginaisCards[index];
        });

        // Remover todas as quebras de página da tela do usuário
        quebrasDePagina.forEach(el => el.remove());
    });
});
});

document.addEventListener("DOMContentLoaded", function() {
    // Busca a modalidade salva pelo EvalPKapp.js
    const modalidade = localStorage.getItem('modalidadeEscolhida');
    
    if (modalidade) {
        // Tenta encontrar o <h1> da página de cards
        const tituloElemento = document.getElementById('tituloPagina');
        
        // Se encontrar o H1, altera o texto dele
        if (tituloElemento) {
            tituloElemento.innerText = 'Avaliação - ' + modalidade;
        }
        
        // Altera o nome da aba do navegador
        document.title = 'Cards - ' + modalidade;
    }
});