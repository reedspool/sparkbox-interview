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

        <section>
          { state.matches("active")
            ? <PokemonList C={state.context} send={send}/>
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
