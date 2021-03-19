import React from 'react';

export default function PokemonEntry({ value, send }) {
    return (
        <li className="flex-0 inline-block border border-gray-300 rounded-md bg-gray-100 shadow-md m-3 p-2">
          <div className="w-full flex mb-1">
            <img className="w-2" src={
            value.favorited
                  ? "img/filled-heart.svg"
                  : "img/empty-heart.svg"
          } />
            <div className="flex-1"></div>
            <div className="flex-none">#{value.id}</div>
          </div>
          <div className="capitalize font-bold">{value.name}</div>
          <div>
            { value.sprites
              ? <img src={value.sprites.front_shiny} alt={value.name + " image"} />
              : <span>Image loading...</span>
            }
          </div>
          <button className="border rounded-md border-red-900 bg-gray-200 shadow-md px-1 w-full" onClick={
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
