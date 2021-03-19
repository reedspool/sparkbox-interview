import React from 'react';

export default function PokemonList({ value }) {
    return (
        <li>
          <div>{value.name}</div>
          <div>{value.id}</div>
          <div>
            { value.sprites
              ? <img src={value.sprites.front_shiny} alt={value.name + " image"} />
              : <span>Image loading...</span>
            }
          </div>
        </li>
    );
}
