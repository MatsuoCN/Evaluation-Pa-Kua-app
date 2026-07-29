/*=========================================================
    PA-KUA AVALIAÇÕES
    EVALPKAPP.JS (Lógica de Cadastro)
=========================================================*/

$(document).ready(function () {

    const $formCadastro = $('#formCadastro');

    // Se não estivermos na página de cadastro (index.html), aborta o script para economizar memória
    if ($formCadastro.length === 0) return;

    // ==========================================
    // 1. LÓGICA DA MODALIDADE (CABEÇALHO)
    // ==========================================
    const $selectModalidade = $('#modalidade');
    if ($selectModalidade.length > 0) {
        
        // Se tiver modalidade salva usa ela, senão puxa o padrão do config.js
        const modalidadeSalva = localStorage.getItem('modalidadeEscolhida') || 
                               (typeof CONFIG !== 'undefined' ? CONFIG.sistema.modalidadePadrao : 'Pa-Kua');
        
        if (modalidadeSalva) {
            $selectModalidade.find(`option:contains("${modalidadeSalva}")`).prop('selected', true);
        }

        // Quando o usuário trocar a modalidade, salva a nova escolha
        $selectModalidade.on('change', function() {
            const nomeModalidade = $(this).find('option:selected').text();
            localStorage.setItem('modalidadeEscolhida', nomeModalidade);
        });
    }

    // ==========================================
    // 2. VERIFICAÇÃO DE MODO EDIÇÃO
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get('edit'); 
    const modoEdicao = editIndex !== null;
    let listaAlunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];

    // Preenche os campos automaticamente se estiver editando
    if (modoEdicao && listaAlunos[editIndex]) {
        const alunoEditado = listaAlunos[editIndex];

        $('h2').text('Editar Aluno');
        $('button[type="submit"]').text('Salvar Alterações');

        $('#nome').val(alunoEditado.nome);
        $('#sobrenome').val(alunoEditado.sobrenome);
        $('#telefone').val(alunoEditado.telefone);
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

    // ==========================================
    // 3. FEEDBACK VISUAL DO BOTÃO DE FOTO
    // ==========================================
    $('#fotoAluno').on('change', function() {
        if (this.files && this.files.length > 0) {
            $('#labelFoto').html('<span class="icone-upload">✅</span><strong>Imagem anexada</strong>').css({
                'background-color': '#f0fdf4',
                'border-color': '#16a34a',
                'color': '#16a34a'
            });
        } else {
            $('#labelFoto').html('<span class="icone-upload">📷</span><strong>Adicionar Foto</strong><small>Clique para selecionar</small>').css({
                'background-color': '#fafafa',
                'border-color': '#CCC',
                'color': '#777'
            });
        }
    });

    // ==========================================
    // 4. FERRAMENTA PARA COMPRIMIR IMAGEM
    // ==========================================
    function comprimirImagem(arquivo) {
        return new Promise((resolve) => {
            const leitor = new FileReader();
            leitor.onload = function(e) {
                const imagem = new Image();
                imagem.onload = function() {
                    const canvas = document.createElement("canvas");
                    const contexto = canvas.getContext("2d");
                    const larguraMaxima = 300; // Tamanho ideal (leve) para o cache do navegador
                    let largura = imagem.width;
                    let altura = imagem.height;

                    if (largura > altura) {
                        if (largura > larguraMaxima) {
                            altura *= larguraMaxima / largura;
                            largura = larguraMaxima;
                        }
                    } else {
                        if (altura > larguraMaxima) {
                            largura *= larguraMaxima / altura;
                            altura = larguraMaxima;
                        }
                    }

                    canvas.width = largura;
                    canvas.height = altura;
                    contexto.drawImage(imagem, 0, 0, largura, altura);
                    
                    resolve(canvas.toDataURL("image/jpeg", 0.7)); // Qualidade 70%
                };
                imagem.src = e.target.result;
            };
            leitor.readAsDataURL(arquivo);
        });
    }

    // ==========================================
    // 5. SALVAMENTO DOS DADOS (SUBMIT)
    // ==========================================
    $formCadastro.on('submit', async function (evento) {
        evento.preventDefault(); // Impede a página de recarregar e perder os dados
        
        const campoFoto = $('#fotoAluno')[0];
        let fotoBase64 = "";
        
        // Muda o texto do botão para indicar processamento
        const $btnSubmit = $(this).find('button[type="submit"]');
        const textoOriginal = $btnSubmit.text();
        $btnSubmit.prop('disabled', true).text('⏳ Salvando...');

        // Se escolheu uma foto nova, processa e comprime
        if (campoFoto.files.length > 0) {
            fotoBase64 = await comprimirImagem(campoFoto.files[0]);
        } 
        // Se for edição e não mexeu na foto, mantém a foto antiga
        else if (modoEdicao) {
            fotoBase64 = listaAlunos[editIndex].foto || "";
        }

        // Monta o objeto com os dados da tela
        const dadosAluno = {
            foto: fotoBase64,
            nome: $('#nome').val(),
            sobrenome: $('#sobrenome').val(),
            telefone: $('#telefone').val(),
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

        // Salva na lista
        if (modoEdicao) {
            listaAlunos[editIndex] = dadosAluno;
        } else {
            listaAlunos.push(dadosAluno);
        }

        localStorage.setItem('alunosPaKua', JSON.stringify(listaAlunos));

        // Finaliza a ação
        if (modoEdicao) {
            window.location.href = "cards.html"; // Volta pros cards se for edição
        } else {
            // Limpa o formulário para um novo cadastro
            $formCadastro[0].reset();
            
            // Reseta visual da foto
            $('#labelFoto').html('<span class="icone-upload">📷</span><strong>Adicionar Foto</strong><small>Clique para selecionar</small>').css({
                'background-color': '#fafafa',
                'border-color': '#CCC',
                'color': '#777'
            });
            
            $('#avalFaixa').prop('checked', true); // Volta o padrão
            $btnSubmit.prop('disabled', false).text(textoOriginal); // Restaura botão
            
            // Exibe mensagem de sucesso
            $('#mensagemSucesso').text('Cadastrado com sucesso!').fadeIn().delay(3000).fadeOut();
            
            // Volta o foco para o primeiro campo (Nome) para agilizar o próximo cadastro
            $('#nome').focus();
        }
    });

});