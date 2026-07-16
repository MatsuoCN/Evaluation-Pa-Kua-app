$(document).ready(function () {

    // ==========================================
    // LÓGICA DA PÁGINA DE CADASTRO (index.html)
    // ==========================================
    const $formCadastro = $('#formCadastro');

    // Verifica se estamos na página do formulário
    if ($formCadastro.length > 0) {

        $formCadastro.on('submit', function (evento) {
            evento.preventDefault();

            // Pega o elemento DOM da foto
            const campoFoto = $('#fotoAluno')[0];

            if (campoFoto.files.length > 0) {
                const leitorDeImagem = new FileReader();

                leitorDeImagem.onload = function (eventoLeitura) {
                    const img = new Image();
                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        const tamanhoMaximo = 300;

                        let largura = img.width;
                        let altura = img.height;

                        if (largura > altura) {
                            if (largura > tamanhoMaximo) {
                                altura *= tamanhoMaximo / largura;
                                largura = tamanhoMaximo;
                            }
                        } else {
                            if (altura > tamanhoMaximo) {
                                largura *= tamanhoMaximo / altura;
                                altura = tamanhoMaximo;
                            }
                        }

                        canvas.width = largura;
                        canvas.height = altura;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, largura, altura);

                        const fotoComprimida = canvas.toDataURL('image/jpeg', 0.7);
                        salvarDadosDoAluno(fotoComprimida);
                    };
                    img.src = eventoLeitura.target.result;
                };

                leitorDeImagem.readAsDataURL(campoFoto.files[0]);
            } else {
                salvarDadosDoAluno("");
            }
        });

        function salvarDadosDoAluno(fotoBase64) {
            // Com jQuery, usamos .val() para pegar o valor e .prop('checked') para checkboxes
            const novoAluno = {
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

            let listaAlunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];
            listaAlunos.push(novoAluno);
            localStorage.setItem('alunosPaKua', JSON.stringify(listaAlunos));

            // Limpa o formulário e reseta o checkbox padrão
            $formCadastro[0].reset();
            $('#avalFaixa').prop('checked', true);

            // O jQuery tem animações nativas super elegantes, como fadeIn e fadeOut
            $('#mensagemSucesso').fadeIn().delay(3000).fadeOut();
        }
    }
})