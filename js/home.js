async function carregarFilmes() {
    const apiKey = '69c6c8da68b6b0f6b07703274553144b';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const filmes = dados.results.slice(0, 20);

        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = ''; // limpa qualquer conteúdo fixo

        filmes.forEach((filme, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            if (index === 0) item.classList.add('active');

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
            img.alt = filme.title;
            img.className = 'd-block w-100';
            img.style.maxHeight = '600px'; // opcional: limita altura

            item.appendChild(img);
            carouselInner.appendChild(item);
        });

    } catch (erro) {
        console.error('Erro ao carregar os filmes:', erro);
    }
}

carregarFilmes();
