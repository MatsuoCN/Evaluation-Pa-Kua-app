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
                callback(canvas.toDataURL('image/jpeg', 0.7)); 
            };
            img.src = e.target.result;
        };
        leitor.readAsDataURL(arquivo);
    }

    // 2. Ferramenta para montar o objeto do Aluno (Atualizada com Telefone)
    function coletarDadosAluno(fotoBase64) {
        return {
            foto: fotoBase64,
            nome: $('#nome').val(),
            sobrenome: $('#sobrenome').val(),
            telefone: $('#telefone').val(), // <-- Adicionado aqui
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

    // ==========================================
    // LÓGICA DA PÁGINA DE CADASTRO (index.html)
    // ==========================================
    const $formCadastro = $('#formCadastro');

    if ($formCadastro.length > 0) {

        const urlParams = new URLSearchParams(window.location.search);
        const editIndex = urlParams.get('edit'); 
        const modoEdicao = editIndex !== null;

        let listaAlunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];

        // SE FOR EDIÇÃO, PREENCHE OS CAMPOS
        if (modoEdicao && listaAlunos[editIndex]) {
            const alunoEditado = listaAlunos[editIndex];

            $('h2').text('Editar Aluno');
            $('button[type="submit"]').text('Salvar Alterações');

            $('#nome').val(alunoEditado.nome);
            $('#sobrenome').val(alunoEditado.sobrenome);
            $('#telefone').val(alunoEditado.telefone); // <-- Preenche o telefone na edição
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

            const finalizarSalvamento = function (fotoBase64) {
                if (modoEdicao && fotoBase64 === "") {
                    fotoBase64 = listaAlunos[editIndex].foto;
                }

                // Coleta todos os dados atualizados
                const dadosAluno = coletarDadosAluno(fotoBase64);

                if (modoEdicao) {
                    listaAlunos[editIndex] = dadosAluno;
                } else {
                    listaAlunos.push(dadosAluno);
                }

                localStorage.setItem('alunosPaKua', JSON.stringify(listaAlunos));

                if (modoEdicao) {
                    window.location.href = "cards.html";
                } else {
                    $formCadastro[0].reset();
                    $('#labelFoto').text('📷 Escolher Arquivo / Tirar Foto').css('background-color', '#34495e');
                    $('#avalFaixa').prop('checked', true);
                    $('#mensagemSucesso').text('Cadastrado com sucesso!').fadeIn().delay(3000).fadeOut();
                }
            };

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
    } // <-- O bloco do cadastro agora fecha corretamente aqui, sem aquelas linhas soltas!

    // ==========================================
    // LÓGICA DA PÁGINA DE CARDS (cards.html)
    // ==========================================
    if ($('#listaCards').length) {
        function carregarCards() {
            const alunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];
            $('#listaCards').empty();

            if (!alunos.length) {
                $('#listaCards').html('<div class="sem-alunos">Nenhum aluno cadastrado ainda.</div>');
                return;
            }

            alunos.forEach((aluno, index) => {
                const statusPagamentoHTML = aluno.pagou
                    ? '<span class="status-pago pago-sim">PAGO</span>'
                    : '<span class="status-pago pago-nao">PENDENTE</span>';

                const tiposHTML = gerarBadges(aluno);

                const corFundo = PALETA[aluno.graduacaoAtual]?.fundo || "#ffffff";
                const corBorda = PALETA[aluno.graduacaoAtual]?.borda || "#bdc3c7";

                const quadradosProgressoHTML = Array(8).fill(`
                        <div class="quadrado-maior">
                            <input type="checkbox" class="quadrante">
                            <input type="checkbox" class="quadrante">
                            <input type="checkbox" class="quadrante">
                            <input type="checkbox" class="quadrante">
                        </div>
                    `).join('');

                const imagemSrc = aluno.foto ? aluno.foto : FOTO_PADRAO;

                // Template do Card atualizado com Telefone e estrutura anti-atropelamento (gap: 15px)
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
                            
                            <!-- Exibição do Telefone no Card -->
                            <p><strong>Telefone:</strong> ${aluno.telefone || 'Não informado'}</p>
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

                $('#listaCards').append(cardHTML);
            });
        }

        window.limparDados = function () {
            if (confirm("Tem certeza que deseja apagar todos?")) {
                localStorage.removeItem('alunosPaKua');
                carregarCards();
            }
        };

        carregarCards();
    }

    // ==========================================
    // LÓGICA DE PREENCHIMENTO PROGRESSIVO DOS QUADRANTES
    // ==========================================
    $(document).on('click', '.quadrante', function(e) {
        e.preventDefault(); 

        const $quadradoMaior = $(this).closest('.quadrado-maior');
        const $todosQuadrantes = $quadradoMaior.find('.quadrante');
        const indexClicado = $todosQuadrantes.index(this);

        let ultimoPintado = -1;
        $todosQuadrantes.each(function(i) {
            if ($(this).prop('checked')) {
                ultimoPintado = i;
            }
        });

        if (indexClicado === ultimoPintado) {
            $todosQuadrantes.prop('checked', false);
        } else {
            $todosQuadrantes.each(function(i) {
                $(this).prop('checked', i <= indexClicado);
            });
        }
    });
});