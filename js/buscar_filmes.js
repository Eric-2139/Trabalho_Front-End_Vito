let generosDisponiveis = [];

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
        linha.style.cursor = 'pointer'; // Mostrar que é clicável
        linha.addEventListener('click', () => exibirCartaz(filme));

        const numero = document.createElement('th');
        numero.scope = 'row';
        numero.textContent = index + 1;

        const titulo = document.createElement('td');
        const botaoCartaz = document.createElement('button');
        botaoCartaz.textContent = filme.title;
        botaoCartaz.classList.add('btn', 'btn-link', 'p-0', 'ver-cartaz');
        botaoCartaz.setAttribute('data-id', filme.id);
        
        // Prevenir que o clique no botão propague para a linha
        botaoCartaz.addEventListener('click', (e) => {
            e.stopPropagation();
            exibirCartaz(filme);
        });
        
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
}

function exibirCartaz(filme) {
    const modalTitulo = document.getElementById('modalTitulo');
    const modalCartaz = document.getElementById('modalCartaz');
    const modalSinopse = document.getElementById('modalSinopse');
    const modalBody = document.querySelector('.modal-body');
    
    // Limpar informações adicionais anteriores
    const infoAnterior = modalBody.querySelector('.info-adicional');
    if (infoAnterior) {
        modalBody.removeChild(infoAnterior);
    }
    
    // Criar novo container para informações
    const infoAdicional = document.createElement('div');
    infoAdicional.className = 'info-adicional mb-3';
    
    // Preencher informações básicas
    modalTitulo.textContent = filme.title;
    modalCartaz.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
    modalCartaz.alt = `Poster de ${filme.title}`;
    
    // Conteúdo da informação adicional
    infoAdicional.innerHTML = `
        <p><strong>Avaliação:</strong> ⭐ ${filme.vote_average.toFixed(1)}/10</p>
        <p><strong>Data de Lançamento:</strong> ${new Date(filme.release_date).toLocaleDateString('pt-BR')}</p>
        <p><strong>Gêneros:</strong> <span class="generos-filme">Carregando...</span></p>
    `;
    
    // Inserir no modal (antes da sinopse)
    const sinopseContainer = modalSinopse.parentNode;
    modalBody.insertBefore(infoAdicional, sinopseContainer);
    
    // Atualizar sinopse
    modalSinopse.textContent = filme.overview || 'Sinopse não disponível.';
    
    // Carregar gêneros
    carregarGenerosFilme(filme.id);
    
    // Abrir o modal
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

async function carregarGenerosFilme(filmeId) {
    try {
        const apiKey = '69c6c8da68b6b0f6b07703274553144b';
        const response = await fetch(`https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`);
        const data = await response.json();
        
        const generos = data.genres.map(g => g.name).join(', ');
        document.querySelector('.generos-filme').textContent = generos || 'Não especificado';
    } catch (error) {
        console.error('Erro ao carregar gêneros:', error);
        document.querySelector('.generos-filme').textContent = 'Erro ao carregar';
    }
}

async function carregarGeneros() {
    try {
        const apiKey = '69c6c8da68b6b0f6b07703274553144b';
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`);
        const data = await response.json();
        generosDisponiveis = data.genres;
        
        // Popular o select
        const select = document.getElementById('filtro-genero');
        generosDisponiveis.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero.id;
            option.textContent = genero.name;
            select.appendChild(option);
        });
        
        // Adicionar evento
        select.addEventListener('change', filtrarPorGenero);
    } catch (error) {
        console.error('Erro ao carregar gêneros:', error);
    }
}

// Função para filtrar
async function filtrarPorGenero() {
    const generoId = document.getElementById('filtro-genero').value;
    
    if (generoId === 'todos') {
        exibirFilmes(listaCompletaFilmes);
        return;
    }
    
    try {
        const apiKey = '69c6c8da68b6b0f6b07703274553144b';
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${generoId}&language=pt-BR`);
        const data = await response.json();
        exibirFilmes(data.results);
    } catch (error) {
        console.error('Erro ao filtrar filmes:', error);
    }
}

// Chamar após carregar os filmes
carregarGeneros();
