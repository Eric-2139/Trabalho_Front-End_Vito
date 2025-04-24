function pesquisarFilme() {
    const termo = document.getElementById('campo-pesquisa').value.toLowerCase();
    const filmesFiltrados = listaCompletaFilmes.filter(filme =>
        filme.title.toLowerCase().includes(termo)
    );
    exibirFilmes(filmesFiltrados);
}

function mostrarTodosFilmes() {
    exibirFilmes(listaCompletaFilmes);
}

function exibirFilmes(lista) {
    const corpoTabela = document.querySelector('tbody');
    corpoTabela.innerHTML = '';

    lista.forEach((filme, index) => {
        const linha = document.createElement('tr');

        const numero = document.createElement('th');
        numero.scope = 'row';
        numero.textContent = index + 1;

        const titulo = document.createElement('td');
        const botaoCartaz = document.createElement('button');
        botaoCartaz.textContent = filme.title;
        botaoCartaz.classList.add('btn', 'btn-link', 'p-0', 'ver-cartaz');
        botaoCartaz.setAttribute('data-id', filme.id);
        titulo.appendChild(botaoCartaz);

        const data = document.createElement('td');
        data.textContent = gerarDataAleatoria();

        const horario = document.createElement('td');
        horario.textContent = gerarHorarioAleatorio();

        linha.appendChild(numero);
        linha.appendChild(titulo);
        linha.appendChild(data);
        linha.appendChild(horario);

        corpoTabela.appendChild(linha);
    });

    // Adiciona evento a cada botão de cartaz
    document.querySelectorAll('.ver-cartaz').forEach(botao => {
        botao.addEventListener('click', () => {
            const id = botao.getAttribute('data-id');
            const filme = lista.find(f => f.id == id);
            if (filme) exibirCartaz(filme);
        });
    });
}


function exibirCartaz(filme) {
    const modalTitulo = document.getElementById('modalTitulo');
    const modalCartaz = document.getElementById('modalCartaz');

    modalTitulo.textContent = filme.title;
    modalCartaz.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;

    // Abrir o modal via JS
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

