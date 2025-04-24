let listaCompletaFilmes = [];

async function carregarTabelaFilmes() {
    const apiKey = '69c6c8da68b6b0f6b07703274553144b';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const filmes = dados.results.slice(0, 50);
        listaCompletaFilmes = filmes;

        const corpoTabela = document.querySelector('tbody');
        corpoTabela.innerHTML = ''; // limpa o conteúdo anterior

        filmes.forEach((filme, index) => {
            const linha = document.createElement('tr');

            const numero = document.createElement('th');
            numero.scope = 'row';
            numero.textContent = index + 1;

            const titulo = document.createElement('td');
            titulo.textContent = filme.title;

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

    } catch (erro) {
        console.error('Erro ao carregar os filmes:', erro);
    }
}

function gerarDataAleatoria() {
    const dia = Math.floor(Math.random() * 30) + 1;
    const mes = Math.floor(Math.random() * 12) + 1;
    const ano = 2025;
    return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
}

function gerarHorarioAleatorio() {
    const hora = Math.floor(Math.random() * 12) + 10; // entre 10h e 21h
    const minuto = Math.random() > 0.5 ? '00' : '30';
    return `${hora}:${minuto}`;
}

// Você pode chamar junto do carregarFilmes ou de forma separada
carregarTabelaFilmes();
