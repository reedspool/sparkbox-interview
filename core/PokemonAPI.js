const MAX_POKEMON_ID = 898;

export async function getOne(nameOrId) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
        .then(result => result.json());
}

export async function getRandomGroup(limit) {
    // 898 maxium found from empirical, manual search
    const offset = Math.floor(Math.random() * (MAX_POKEMON_ID - limit));
    return fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
        .then(result => result.json());
}
