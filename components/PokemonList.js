import React, { useEffect } from 'react';
import PokemonEntry from "./PokemonEntry";

export default function PokemonList({ entries, send }) {
    return (
        <ol>
            {
                entries.map(
                    (value) =>
                    <PokemonEntry value={ value } key={ value.id }
                          send={send} />
                )
            }
        </ol>
    );
}
