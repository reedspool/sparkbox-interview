export async function getOne(nameOrId) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
        .then(result => result.json());
}
