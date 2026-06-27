// ==========================================
// LÓGICA DA PÁGINA DE CADASTRO (index.html)
// ==========================================
const form = document.getElementById('formCadastro');

if (form) {
    const mensagemSucesso = document.getElementById('mensagemSucesso');

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();

        // 1. Pega o arquivo de imagem do formulário
        const campoFoto = document.getElementById('fotoAluno');

        // 2. Verifica se o usuário escolheu uma foto
        if (campoFoto.files.length > 0) {
            const leitorDeImagem = new FileReader();

            // Quando terminar de ler a imagem, ele executa a função de salvar
            leitorDeImagem.onload = function (eventoLeitura) {
                const fotoBase64 = eventoLeitura.target.result; // A imagem transformada em texto
                salvarDadosDoAluno(fotoBase64);
            };

            // Inicia a leitura da foto
            leitorDeImagem.readAsDataURL(campoFoto.files[0]);
        } else {
            // Se não tiver foto, salva com uma imagem em branco
            salvarDadosDoAluno("");
        }
    });

    // Função que empacota os dados e salva
    function salvarDadosDoAluno(fotoBase64) {
        const novoAluno = {
            foto: fotoBase64, // Adicionamos a foto aqui
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