import { Machine } from "xstate";
import { assign } from '@xstate/immer';
import { getIdFromUrl, getOne, getRandomGroup } from "./PokemonAPI.js";
const AMOUNT = 50;

export const definition = {
    strict: true,
    id: "core",
    initial: "loadingRandom",
    states: {
        loadingRandom: {
            invoke : {
                id: "fetchRandom",
                src: "fetchRandom",
                onDone: {
                    target: "loadingIndividuals",
                    actions: ["recordGroup"]
                },
                onError: {
                    target: "failure",
                    actions: () => alert("There was a problem with the Pokemon API :(")
                }
            },
        },
        loadingIndividuals: {
            invoke : {
                id: "fetchIndividuals",
                src: "fetchIndividuals",
                onDone: {
                    target: "active",
                    actions: ["recordIndividuals"]
                },
                onError: {
                    target: "failure",
                    actions: () => alert("There was a problem with the Pokemon API :(")
                }
            }
        },
        active: {},
        failure: { type: "final" }
    },
    on: {}
};

export const config = {
    actions: {
        recordGroup: assign((C, E) => {
            C.group = E.data.results;
            C.individualsById = {};

            // Transform the list of { url, name } into
            // a map of id => { name }
            E.data.results.forEach(
                ({ url, name }) =>
                    C.individualsById[getIdFromUrl(url)] = { name });
        }),
        recordIndividuals: assign((C, E) => {
            // Unpack into existing skeleton
            E.data.forEach(({ id, sprites }) => {
                C.individualsById[id].sprites = sprites;
            })
        })
    },
    guards : {},
    services: {
        fetchRandom : () => getRandomGroup(AMOUNT),
        fetchIndividuals : (C, E) => {
            return Promise.all(
                E.data.results.map(({ url }) =>
                    getOne(getIdFromUrl(url))));
        }
    }
};

export const init = () => Machine(definition, config);
