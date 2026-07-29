/*=========================================================
    PA-KUA AVALIAÇÕES
    CARDS.JS V2.0
=========================================================*/

$(document).ready(function(){

const $listaCards = $("#listaCards");

/*=========================================================
    VERIFICA PÁGINA
=========================================================*/
if(!$listaCards.length){
    return;
}

/*=========================================================
    UTILITÁRIOS
=========================================================*/
function obterAlunos(){
    return JSON.parse(
        localStorage.getItem("alunosPaKua")
    ) || [];
}

function obterModalidade(){
    return (
        localStorage.getItem("modalidadeEscolhida")
        ||
        CONFIG.sistema.modalidadePadrao
    );
}

/*=========================================================
    BADGES
=========================================================*/
function criarBadges(aluno){
    let html="";

    if(CONFIG.cards.mostrarBadges && aluno.avalFaixa){
        html += `<span class="badge-tipo">Faixa</span>`;
    }

    if(CONFIG.cards.mostrarBadges && aluno.avalDistintivo){
        html += `<span class="badge-tipo">Distintivo</span>`;
    }

    if(html===""){
        html=`<span class="badge-tipo">Não informado</span>`;
    }
    return html;
}

/*=========================================================
    PAGAMENTO
=========================================================*/
function criarStatusPagamento(aluno){
    if(!CONFIG.cards.mostrarPagamento){
        return "";
    }

    return aluno.pagou
    ? `<span class="badge-status pago">✔ Pago</span>`
    : `<span class="badge-status pendente">⌛ Pendente</span>`;
}

/*=========================================================
    QUADRANTES DE AVALIAÇÃO
=========================================================*/
function criarQuadrantes(aluno,index){
    let html="";

    if(!aluno.avaliacaoQuadrantes){
        aluno.avaliacaoQuadrantes = Array(CONFIG.cards.quantidadeQuadrantes * 4).fill(false);
    }

    let contador=0;

    for(let grupo=0; grupo<CONFIG.cards.quantidadeQuadrantes; grupo++){
        html+=`<div class="quadrado-maior">`;

        for(let q=0;q<4;q++){
            const marcado = aluno.avaliacaoQuadrantes[contador] ? "marcado" : "";

            html+=`
            <span
            class="quadrante ${marcado}"
            data-aluno="${index}"
            data-quadrante="${contador}"
            >
            </span>
            `;
            contador++;
        }
        html+=`</div>`;
    }
    return html;
}

/*=========================================================
    INFORMAÇÕES
=========================================================*/
function criarInformacoes(aluno){
    return `
    <div class="info-grid">
    ${CONFIG.cards.mostrarOrientador ? `
    <div class="info-item">
    <span>👤 Orientador</span>
    <strong>${aluno.orientador || "-"}</strong>
    </div>` : ""}

    ${CONFIG.cards.mostrarRecinto ? `
    <div class="info-item">
    <span>🏫 Recinto</span>
    <strong>${aluno.recinto || "-"}</strong>
    </div>` : ""}

    ${CONFIG.cards.mostrarTelefone ? `
    <div class="info-item">
    <span>📞 WhatsApp</span>
    <strong>${aluno.telefone || "-"}</strong>
    </div>` : ""}

    ${CONFIG.cards.mostrarTempoFaixa ? `
    <div class="info-item">
    <span>Tempo</span>
    <strong>${aluno.tempoFaixa || "-"}</strong>
    </div>` : ""}
    </div>
    `;
}

/*=========================================================
    CRIA CARD
=========================================================*/
function criarCard(aluno,index){

    const modalidade = obterModalidade();
    const faixa = CONFIG.faixas[aluno.graduacaoAtual] || CONFIG.faixas.Branca;
    const faixaNova = CONFIG.faixas[aluno.faixaNova] || CONFIG.faixas.Branca;
    const imagem = aluno.foto ? aluno.foto : CONFIG.imagens.avatarPadrao;

    return `
    <div class="card faixa-${aluno.graduacaoAtual}" style="background:${faixa.fundo}; border:2px solid ${faixa.borda};">

        <div class="card-header">
            <div class="foto-wrapper">
                <img src="${imagem}" class="foto-aluno" alt="Foto aluno">
            </div>

            <div class="dados-principais">
                <h3>${aluno.nome} ${aluno.sobrenome}</h3>
                <span class="modalidade">${modalidade}</span>
                ${CONFIG.cards.mostrarIdade ? `<span class="idade">${aluno.idade || "-"} anos</span>` : ""}
            </div>

            <div class="status">
                ${criarStatusPagamento(aluno)}
            </div>
        </div>

        <div class="faixas">
            <div class="faixa-box" style="background:${faixa.fundo}; border:2px solid ${faixa.borda};">
                <small>Faixa Atual</small>
                <strong>${aluno.graduacaoAtual}</strong>
            </div>

            <div class="seta">→</div>

            <div class="faixa-box" style="background:${faixaNova.fundo}; border:2px solid ${faixaNova.borda};">
                <small>Avaliando para</small>
                <strong>${aluno.faixaNova}</strong>
            </div>
        </div>

        ${criarInformacoes(aluno)}

        <div class="tipos-avaliacao">
            ${criarBadges(aluno)}
        </div>

        <div class="area-avaliacao">
            <h4>Ficha de Avaliação</h4>
            <div class="area-quadrantes">
                <!-- CORRIGIDO: Passando aluno e index para a função! -->
                ${criarQuadrantes(aluno, index)}
            </div>
        </div>

        <div class="card-footer">
            <a href="index.html?edit=${index}" class="btn-editar">
                ✏ Editar Cadastro
            </a>
        </div>
    </div>
    `;
}

/*=========================================================
    RENDERIZAÇÃO
=========================================================*/
function carregarCards(){
    const alunos = obterAlunos();
    $listaCards.empty();

    if(!alunos.length){
        $listaCards.html(`
        <div class="sem-alunos">
        Nenhum aluno cadastrado ainda.
        </div>
        `);
        return;
    }

    let html="";
    alunos.forEach((aluno,index)=>{
        html += criarCard(aluno,index);
    });

    $listaCards.html(html);
}

/*=========================================================
    LIMPAR DADOS
=========================================================*/
window.limparDados=function(){
    if(confirm("Tem certeza que deseja apagar todos os alunos cadastrados?")){
        localStorage.removeItem("alunosPaKua");
        carregarCards();
    }
};

/*=========================================================
    EVENTOS QUADRANTES (AGORA SALVA NA MEMÓRIA!)
=========================================================*/
$(document).on("click", ".quadrante", function(e){
    e.preventDefault();
    const $this = $(this);
    
    // 1. Muda a cor na tela
    $this.toggleClass("marcado");
    
    // 2. Descobre quem é o aluno e qual quadrante foi clicado
    const alunoIndex = $this.data("aluno");
    const quadranteIndex = $this.data("quadrante");
    const estaMarcado = $this.hasClass("marcado");

    // 3. Salva a nova informação no LocalStorage para não perder ao recarregar a página
    const alunos = obterAlunos();
    if(alunos[alunoIndex]){
        if(!alunos[alunoIndex].avaliacaoQuadrantes){
            alunos[alunoIndex].avaliacaoQuadrantes = Array(CONFIG.cards.quantidadeQuadrantes * 4).fill(false);
        }
        alunos[alunoIndex].avaliacaoQuadrantes[quadranteIndex] = estaMarcado;
        localStorage.setItem("alunosPaKua", JSON.stringify(alunos));
    }
});

/*=========================================================
    TÍTULO
=========================================================*/
const modalidade = localStorage.getItem("modalidadeEscolhida");
if(modalidade){
    const titulo = document.getElementById("tituloPagina");
    if(titulo){
        titulo.innerText = "Avaliação - " + modalidade;
    }
    document.title = "Cards - " + modalidade;
}

/*=========================================================
    INICIALIZA
=========================================================*/
carregarCards();

});