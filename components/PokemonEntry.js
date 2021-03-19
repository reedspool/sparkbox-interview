import React from 'react';

export default function PokemonEntry({ value, send }) {
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
          <button onClick={
              value.favorited
                  ? () => send({ type: "UNFAVORITE", id: value.id})
                  : () => send({ type: "FAVORITE", id: value.id})
          }>{
              value.favorited
                  ? "Unfavorite"
                  : "Favorite"
          }</button>
        </li>
    );
}
