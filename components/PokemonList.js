import React, { useEffect } from 'react';
import PokemonEntry from "./PokemonEntry";

export default function PokemonList({ C }) {
    return (
        <ol>
            {
                Object.entries(C.individualsById).map(
                    ([id, value]) =>
                        <PokemonEntry value= { value } key = { id } />
                )
            }
        </ol>
    );
}
