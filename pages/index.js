import React, { useEffect } from 'react';
import Head from 'next/head'
import Layout from '../components/layout'
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";
import * as CoreMachine from "../core/CoreMachine";
import PokemonList from "../components/PokemonList";

export default function Home() {

  const [state, send] = useMachine(
    Machine(CoreMachine.definition).withConfig(CoreMachine.config),
    { devTools: true });

  return (
    <Layout>
      <Head>
        <title>Your Favorite Pokemon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="center">
        <h1 className="text-4xl my-10">Your Favorite Pokemon</h1>

        <div>
          <span>Sorted by {
            state.matches("sorting.byId")
            ? "ID"
            : "name"
          }</span>
          &nbsp;
          <button className="mx-5 border border-red-900 rounded-sm px-1 bg-gray-200" onClick={
            state.matches("sorting.byId")
              ? () => send("SORT_BY_NAME")
              : () => send("SORT_BY_ID")
          }>{
            state.matches("sorting.byId")
            ? "Sort by name"
            : "Sort by ID"
          }</button>
        </div>
        <section className="mt-5 flex items-center">
          { state.matches("individuals.active")
            ? <PokemonList entries={
              state.context.sortedIndividualIds.map((id) =>
                state.context.individualsById[id])} send={send}/>
            : <h2 className="text-xl">Loading...</h2>
          }
        </section>
      </main>
      <footer>
        Catch'm all!
        <div>Red heart icon made by <a href="https://www.flaticon.com/authors/itim2101" title="itim2101">itim2101</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Empty heart made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        <div>Pokemon Data and images from https://pokeapi.co/</div>
      </footer>
    </Layout>
  )
}
