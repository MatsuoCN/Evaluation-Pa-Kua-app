
const form = document.getElementById('formCadastro');

if (form) {
    const mensagemSucesso = document.getElementById('mensagemSucesso');

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const campoFoto = document.getElementById('fotoAluno');

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

                    // Converte a imagem encolhida de volta para texto (formato JPEG com 70% de qualidade)
                    const fotoComprimida = canvas.toDataURL('image/jpeg', 0.7);

                    // Agora sim, salvamos a foto leve!
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
        const novoAluno = {
            foto: fotoBase64,
            nome: document.getElementById('nome').value,
            sobrenome: document.getElementById('sobrenome').value,
            idade: document.getElementById('idade').value,
            orientador: document.getElementById('orientador').value,
            recinto: document.getElementById('recinto').value,
            graduacaoAtual: document.getElementById('graduacaoAtual').value,
            tempoFaixa: document.getElementById('tempoFaixa').value,
            faixaNova: document.getElementById('faixaNova').value,
            pagou: document.getElementById('pagou').checked,
            avalFaixa: document.getElementById('avalFaixa').checked,
            avalDistintivo: document.getElementById('avalDistintivo').checked
        };

        let listaAlunos = JSON.parse(localStorage.getItem('alunosPaKua')) || [];
        listaAlunos.push(novoAluno);
        localStorage.setItem('alunosPaKua', JSON.stringify(listaAlunos));

        form.reset();
        document.getElementById('avalFaixa').checked = true;

        mensagemSucesso.style.display = 'block';
        setTimeout(() => { mensagemSucesso.style.display = 'none'; }, 3000);
    }
}

