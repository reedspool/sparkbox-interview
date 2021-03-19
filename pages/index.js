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
        <title>Pokemon Rating</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-4xl">Pokemon Rating System</h1>

        <div>
          <span>Sorted by {
            state.matches("sorting.byId")
            ? "ID"
            : "name"
          }</span>
          &nbsp;
          <button onClick={
            state.matches("sorting.byId")
              ? () => send("SORT_BY_NAME")
              : () => send("SORT_BY_ID")
          }>{
            state.matches("sorting.byId")
            ? "Sort by name"
            : "Sort by ID"
          }</button>
        </div>
        <section>
          { state.matches("individuals.active")
            ? <PokemonList entries={
              state.context.sortedIndividualIds.map((id) =>
                state.context.individualsById[id])} send={send}/>
            : <h2 className="text-xl">Loading...</h2>
          }
        </section>
      </main>
      <footer>
        This is a work in progress.
      </footer>
    </Layout>
  )
}
