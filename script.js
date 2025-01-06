// DOM Elements
const pokemonContainer = document.querySelector('.pokemon-container');
const pokemonDetail = document.getElementById('pokemon-detail');

// Fetch Generation 4 Pokemon (387-493)
async function fetchPokemons() {
    try {
        // We halen Generation 4 Pokemon op (387-493)
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=107&offset=386');
        const data = await response.json();
        
        // Voor elke Pokemon halen we de details op
        data.results.forEach(pokemon => {
            fetchPokemonData(pokemon.url);
        });
    } catch (error) {
        console.error('Error fetching Pokemon:', error);
    }
}

// Fetch specifieke Pokemon data
async function fetchPokemonData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        createPokemonCard(data);
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
    }
}

// Maak een Pokemon kaart
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.dataset.id = pokemon.id;
    
    // Gebruik de showdown sprites
    const image = document.createElement('img');
    image.src = `sprites/sprites/pokemon/other/showdown/${pokemon.id}.gif`;
    image.alt = pokemon.name;
    image.classList.add('pokemon-sprite');
    
    // Pokemon naam (eerste letter hoofdletter)
    const name = document.createElement('h3');
    name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    
    card.appendChild(image);
    card.appendChild(name);
    
    // Voeg click event toe voor de details
    card.addEventListener('click', () => {
        // Verwijder selected class van alle kaarten
        document.querySelectorAll('.pokemon-card').forEach(card => {
            card.classList.remove('selected');
        });
        // Voeg selected class toe aan deze kaart
        card.classList.add('selected');
        showPokemonDetails(pokemon);
    });
    
    pokemonContainer.appendChild(card);
}

// Type kleuren voor de badges
const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
};

// Bepaal de klasse voor de stat bar gebaseerd op de waarde
function getStatClass(value) {
    if (value < 50) return 'low';
    if (value < 90) return 'medium';
    return 'high';
}

// Toon Pokemon details
function showPokemonDetails(pokemon) {
    // Activeer de details sectie
    pokemonDetail.classList.add('active');
    
    // Maak de types HTML met de juiste kleuren
    const typesHtml = pokemon.types.map(type => `
        <span class="type" style="background-color: ${typeColors[type.type.name]}">
            ${type.type.name}
        </span>
    `).join('');

    pokemonDetail.innerHTML = `
        <div class="pokemon-info">
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <div class="sprite-container">
                <div class="sprite-wrapper">
                    <img src="sprites/sprites/pokemon/other/showdown/${pokemon.id}.gif" alt="${pokemon.name}">
                    <p>Normal</p>
                </div>
                <div class="sprite-wrapper">
                    <img src="sprites/sprites/pokemon/other/showdown/shiny/${pokemon.id}.gif" alt="Shiny ${pokemon.name}">
                    <p>Shiny</p>
                </div>
            </div>
            <div class="types">${typesHtml}</div>
            <div>
                <p>Gewicht: ${pokemon.weight / 10} kg</p>
                <p>Hoogte: ${pokemon.height / 10} m</p>
            </div>
        </div>
        <div class="stats-container">
            <h3>Stats:</h3>
            ${pokemon.stats.map(stat => `
                <div>
                    <p>${stat.stat.name}: ${stat.base_stat}</p>
                    <div class="stat-bar">
                        <div class="stat-fill ${getStatClass(stat.base_stat)}" 
                             style="width: ${(stat.base_stat / 255) * 100}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Start de applicatie
fetchPokemons(); 