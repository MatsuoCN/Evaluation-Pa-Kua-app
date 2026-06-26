const form = document.getElementById('formCadastro');
const mensagemSucesso = document.getElementById('mensagemSucesso');

form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const novoAluno = {
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
});
// Transforma a lista em texto (JSON) e salva na memória do navegador com a etiqueta 'alunosPaKua'
localStorage.setItem('alunosPaKua', JSON.stringify(listaAlunos));
