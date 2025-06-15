async function carregarFilmes() {
    const apiKey = '69c6c8da68b6b0f6b07703274553144b';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const filmes = dados.results.slice(0, 20);

        // 1. Carregar carrossel
        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = '';

        filmes.forEach((filme, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            if (index === 0) carouselItem.classList.add('active');

            // Usar backdrop_path quando disponível, senão usar poster_path
            const imagemUrl = filme.backdrop_path 
                ? `https://image.tmdb.org/t/p/w1280${filme.backdrop_path}`
                : `https://image.tmdb.org/t/p/w1280${filme.poster_path}`;

            const carouselImg = document.createElement('img');
            carouselImg.src = imagemUrl;
            carouselImg.alt = filme.title;
            carouselImg.className = 'd-block w-100 carousel-img';
            
            // Adicionar overlay com informações
            const carouselCaption = document.createElement('div');
            carouselCaption.className = 'carousel-caption d-none d-md-block';
            carouselCaption.innerHTML = `
                <h3>${filme.title}</h3>
                <p>⭐ ${filme.vote_average.toFixed(1)}/10 | ${new Date(filme.release_date).toLocaleDateString('pt-BR')}</p>
                <button class="btn btn-primary btn-sm ver-detalhes-carrossel" data-id="${filme.id}">
                    Ver Detalhes
                </button>
            `;
            
            carouselItem.appendChild(carouselImg);
            carouselItem.appendChild(carouselCaption);
            carouselInner.appendChild(carouselItem);
        });

        // Iniciar carrossel automático
        const carrossel = document.getElementById('carouselExampleFade');
        const carrosselInstance = new bootstrap.Carousel(carrossel, {
            interval: 3000, // 3 segundos entre transições
            ride: 'carousel',
            pause: false // Não pausar ao passar o mouse
        });

        // 2. Carregar lista de filmes em destaque
        const filmesDestaque = document.getElementById('filmes-destaque');
        filmesDestaque.innerHTML = '';

        filmes.forEach(filme => {
            const filmeCol = document.createElement('div');
            filmeCol.className = 'col-md-3 mb-4';

            filmeCol.innerHTML = `
                <div class="card h-100">
                    <img src="https://image.tmdb.org/t/p/w300${filme.poster_path}" class="card-img-top" alt="${filme.title}">
                    <div class="card-body">
                        <h5 class="card-title">${filme.title}</h5>
                        <p class="card-text">
                            <span class="badge bg-primary">⭐ ${filme.vote_average.toFixed(1)}/10</span>
                            <small class="text-muted d-block mt-1">${new Date(filme.release_date).toLocaleDateString('pt-BR')}</small>
                        </p>
                        <button class="btn btn-outline-primary btn-sm ver-detalhes" data-id="${filme.id}">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            `;

            filmesDestaque.appendChild(filmeCol);
        });

        // 3. Adicionar eventos aos botões de detalhes
        document.querySelectorAll('.ver-detalhes, .ver-detalhes-carrossel').forEach(botao => {
            botao.addEventListener('click', async () => {
                // Pausar carrossel enquanto o modal estiver aberto
                carrosselInstance.pause();
                
                const filmeId = botao.getAttribute('data-id');
                const filme = filmes.find(f => f.id == filmeId);
                if (filme) await exibirDetalhesFilme(filme);
                
                // Retomar automaticamente quando o modal fechar
                document.getElementById('filmeModal').addEventListener('hidden.bs.modal', () => {
                    carrosselInstance.cycle();
                }, { once: true });
            });
        });

    } catch (erro) {
        console.error('Erro ao carregar os filmes:', erro);
        // Adicionar tratamento de erro visual se desejar
    }
}


function iniciarCarrosselAutomatico() {
    const carrossel = document.getElementById('carouselExampleFade');
    const carrosselInstance = new bootstrap.Carousel(carrossel, {
        interval: 3000, // 3 segundos entre cada transição
        ride: 'carousel',
        pause: false // Não pausar ao passar o mouse
    });
    
    // Pausar apenas quando o modal estiver aberto
    document.getElementById('filmeModal').addEventListener('show.bs.modal', () => {
        carrosselInstance.pause();
    });
    
    document.getElementById('filmeModal').addEventListener('hidden.bs.modal', () => {
        carrosselInstance.cycle();
    });
}

async function exibirDetalhesFilme(filme) {
    const modal = new bootstrap.Modal(document.getElementById('filmeModal'));
    
    document.getElementById('filmeModalLabel').textContent = filme.title;
    document.getElementById('modalPoster').src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
    document.getElementById('modalAvaliacao').textContent = `${filme.vote_average.toFixed(1)}/10`;
    document.getElementById('modalData').textContent = new Date(filme.release_date).toLocaleDateString('pt-BR');
    document.getElementById('modalSinopse').textContent = filme.overview || 'Sinopse não disponível.';

    try {
        const apiKey = '69c6c8da68b6b0f6b07703274553144b';
        const response = await fetch(`https://api.themoviedb.org/3/movie/${filme.id}?api_key=${apiKey}&language=pt-BR`);
        const data = await response.json();
        const generos = data.genres.map(g => g.name).join(', ');
        document.getElementById('modalGeneros').textContent = generos || 'Não especificado';
    } catch (error) {
        console.error('Erro ao carregar gêneros:', error);
        document.getElementById('modalGeneros').textContent = 'Erro ao carregar';
    }

    modal.show();
}

carregarFilmes();