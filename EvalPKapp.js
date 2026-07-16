$(document).ready(function () {

    // ==========================================
    // CONFIGURAÇÕES GERAIS E PALETAS
    // ==========================================
    const PALETA = {
        "Branca": { fundo: "#ffffff", borda: "#bdc3c7" },
        "Amarela": { fundo: "#fef9e7", borda: "#f1c40f" },
        "Laranja": { fundo: "#fdf2e9", borda: "#e67e22" },
        "Verde": { fundo: "#e9f7ef", borda: "#27ae60" }
    };
    const FOTO_PADRAO = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

    // ==========================================
    // FUNÇÕES AUXILIARES (As nossas "Ferramentas")
    // ==========================================

    // 1. Ferramenta para comprimir a imagem
    function comprimirImagem(arquivo, callback) {
        const leitor = new FileReader();
        leitor.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const max = 300;
                let { width: w, height: h } = img;

                if (w > h && w > max) { h *= max / w; w = max; }
                else if (h > max) { w *= max / h; h = max; }

                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                callback(canvas.toDataURL('image/jpeg', 0.7)); // Devolve a foto leve
            };
            img.src = e.target.result;
        };
        leitor.readAsDataURL(arquivo);
    }

    // 2. Ferramenta para montar o objeto do Aluno
    function coletarDadosAluno(fotoBase64) {
        return {
            foto: fotoBase64,
            nome: $('#nome').val(),
            sobrenome: $('#sobrenome').val(),
            idade: $('#idade').val(),
            orientador: $('#orientador').val(),
            recinto: $('#recinto').val(),
            graduacaoAtual: $('#graduacaoAtual').val(),
            tempoFaixa: $('#tempoFaixa').val(),
            faixaNova: $('#faixaNova').val(),
            pagou: $('#pagou').prop('checked'),
            avalFaixa: $('#avalFaixa').prop('checked'),
            avalDistintivo: $('#avalDistintivo').prop('checked')
        };
    }

    // 3. Ferramenta para desenhar os distintivos/faixa
    function gerarBadges(aluno) {
        let badges = [];
        if (aluno.avalFaixa) badges.push('<span class="badge-tipo">Faixa</span>');
        if (aluno.avalDistintivo) badges.push('<span class="badge-tipo">Distintivo</span>');
        return badges.length ? badges.join(' ') : '<span class="badge-tipo">Não especificado</span>';
    }

    // 4. Ferramenta para desenhar o HTML completo de um Card
    function gerarCardHTML(aluno) {
        const cores = PALETA[aluno.graduacaoAtual] || { fundo: "#ffffff", borda: "#bdc3c7" };
        const statusPago = aluno.pagou ? '<span class="status-pago pago-sim">PAGO</span>' : '<span class="status-pago pago-nao">PENDENTE</span>';
        const foto = aluno.foto || FOTO_PADRAO;

        const quadradosHTML = Array(8).fill(`
            <div class="quadrado-maior">
                <input type="checkbox" class="quadrante"><input type="checkbox" class="quadrante">
                <input type="checkbox" class="quadrante"><input type="checkbox" class="quadrante">
            </div>
        `).join('');

        return `
            <div class="card" style="background-color: ${cores.fundo}; border-left-color: ${cores.borda};">
                ${statusPago}
                <div class="card-cabecalho">
                    <img src="${foto}" class="foto-aluno" alt="Foto">
                    <div class="card-titulos">
                        <h3>${aluno.nome} ${aluno.sobrenome}</h3>
                        <span style="font-size: 13px; color: #7f8c8d;">Idade: ${aluno.idade} anos</span>
                    </div>
                </div>
                <p><strong>Recinto:</strong> ${aluno.recinto}</p>
                <p><strong>Orientador(a):</strong> ${aluno.orientador}</p>
                <p><strong>Graduação Atual:</strong> ${aluno.graduacaoAtual} (${aluno.tempoFaixa})</p>
                <p><strong>Avaliando para:</strong> ${aluno.faixaNova}</p>
                <p style="margin-top: 10px;">${gerarBadges(aluno)}</p>
                <div class="area-quadrantes">${quadradosHTML}</div>
            </div>
        `;
    }

    // ==========================================
    // LÓGICA DE FUNCIONAMENTO (Ação!)
    // ==========================================

    // ---> SE ESTIVER NA PÁGINA DE CADASTRO
    // ==========================================
    // LÓGICA DA PÁGINA DE CADASTRO (index.html)
    // ==========================================
    const $formCadastro = $('#formCadastro');

    if ($formCadastro.length > 0) {

        // 1. LÊ SE ESTAMOS EDITANDO ALGUÉM
        const urlParams = new URLSearchParams(window.location.search);
        const editIndex = urlParams.get('edit'); // Pega o número do aluno na URL
        const modoEdicao = editIndex !== null;

        let listaAlunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];

        // 2. SE FOR EDIÇÃO, PREENCHE OS CAMPOS
        if (modoEdicao && listaAlunos[editIndex]) {
            const alunoEditado = listaAlunos[editIndex];

            // Muda os títulos para fazer sentido
            $('h2').text('Editar Aluno');
            $('button[type="submit"]').text('Salvar Alterações');

            // Preenche os dados
            $('#nome').val(alunoEditado.nome);
            $('#sobrenome').val(alunoEditado.sobrenome);
            $('#idade').val(alunoEditado.idade);
            $('#orientador').val(alunoEditado.orientador);
            $('#recinto').val(alunoEditado.recinto);
            $('#graduacaoAtual').val(alunoEditado.graduacaoAtual);
            $('#tempoFaixa').val(alunoEditado.tempoFaixa);
            $('#faixaNova').val(alunoEditado.faixaNova);
            $('#pagou').prop('checked', alunoEditado.pagou);
            $('#avalFaixa').prop('checked', alunoEditado.avalFaixa);
            $('#avalDistintivo').prop('checked', alunoEditado.avalDistintivo);
        }

        $formCadastro.on('submit', function (evento) {
            evento.preventDefault();
            const campoFoto = $('#fotoAluno')[0];

            // Função que salva os dados (nova ou editada)
            const finalizarSalvamento = function (fotoBase64) {

                // Se estiver editando e não colocou foto nova, mantém a velha
                if (modoEdicao && fotoBase64 === "") {
                    fotoBase64 = listaAlunos[editIndex].foto;
                }

                const dadosAluno = {
                    foto: fotoBase64,
                    nome: $('#nome').val(),
                    sobrenome: $('#sobrenome').val(),
                    idade: $('#idade').val(),
                    orientador: $('#orientador').val(),
                    recinto: $('#recinto').val(),
                    graduacaoAtual: $('#graduacaoAtual').val(),
                    tempoFaixa: $('#tempoFaixa').val(),
                    faixaNova: $('#faixaNova').val(),
                    pagou: $('#pagou').prop('checked'),
                    avalFaixa: $('#avalFaixa').prop('checked'),
                    avalDistintivo: $('#avalDistintivo').prop('checked')
                };

                if (modoEdicao) {
                    // Se for edição, substitui na mesma posição
                    listaAlunos[editIndex] = dadosAluno;
                } else {
                    // Se for novo, adiciona no final
                    listaAlunos.push(dadosAluno);
                }

                localStorage.setItem('alunosPaKua', JSON.stringify(listaAlunos));

                if (modoEdicao) {
                    // Se editou, volta para os cards na mesma hora
                    window.location.href = "cards.html";
                } else {
                    // Se cadastrou novo, limpa a tela
                    $formCadastro[0].reset();
                    $('#avalFaixa').prop('checked', true);
                    $('#mensagemSucesso').text('Cadastrado com sucesso!').fadeIn().delay(3000).fadeOut();
                }
            };

            // Lógica de compressão de foto
            if (campoFoto.files.length > 0) {
                const leitorDeImagem = new FileReader();
                leitorDeImagem.onload = function (eventoLeitura) {
                    const img = new Image();
                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        const tamanhoMaximo = 300;
                        let largura = img.width; let altura = img.height;
                        if (largura > altura) { if (largura > tamanhoMaximo) { altura *= tamanhoMaximo / largura; largura = tamanhoMaximo; } }
                        else { if (altura > tamanhoMaximo) { largura *= tamanhoMaximo / altura; altura = tamanhoMaximo; } }
                        canvas.width = largura; canvas.height = altura;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, largura, altura);
                        finalizarSalvamento(canvas.toDataURL('image/jpeg', 0.7));
                    };
                    img.src = eventoLeitura.target.result;
                };
                leitorDeImagem.readAsDataURL(campoFoto.files[0]);
            } else {
                finalizarSalvamento("");
            }
        });
    }
    // Usa a ferramenta 1 se tiver foto, senão salva vazio
    if (campoFoto.files.length) comprimirImagem(campoFoto.files[0], salvar);
    else salvar("");
});


// ---> SE ESTIVER NA PÁGINA DE CARDS
if ($('#listaCards').length) {
    function carregarCards() {
        const alunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];
        $('#listaCards').empty();

        if (!alunos.length) {
            $('#listaCards').html('<div class="sem-alunos">Nenhum aluno cadastrado ainda.</div>');
            return;
        }

        // Para cada aluno, usa a ferramenta 4 para desenhar e injeta na tela
        // ATENÇÃO AQUI: Adicionamos o "index" ao lado do aluno
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

            const cardHTML = `
                    <div class="card" style="background-color: ${corFundo}; border-left-color: ${corBorda};">
                        ${statusPagamentoHTML}
                        
                        <div class="card-cabecalho">
                            <img src="${imagemSrc}" class="foto-aluno" alt="Foto">
                            <div class="card-titulos">
                                <h3>${aluno.nome} ${aluno.sobrenome}</h3>
                                <span style="font-size: 13px; color: #7f8c8d;">Idade: ${aluno.idade} anos</span>
                            </div>
                            <!-- AQUI ESTÁ O NOVO BOTÃO DE EDITAR -->
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
        if (confirm("Tem certeza que deseja apagar todos?")) {
            localStorage.removeItem('alunosPaKua');
            carregarCards();
        }
    };

    carregarCards();
};