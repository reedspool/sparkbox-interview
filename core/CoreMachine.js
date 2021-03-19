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
                    target: "active",
                    actions: ["recordGroup"]
                },
                onError: {
                    target: "failure",
                    actions: () => alert("There was a problem with the Pokemon API :(")
                }
            },
        },
        active : {
            initial: "loadingIndividuals",
            states: {
                loadingIndividuals: {
                    invoke: {
                        id: "fetchIndividuals",
                        src: "fetchIndividuals",
                        onDone: {
                            target: "idle",
                            actions: ["recordIndividuals"]
                        },
                        onError: {
                            target: "#core.failure",
                            actions: [ "alertProblemWithAPI" ]
                        }
                    },
                },
                idle : {}
            },
            on : {
                FAVORITE : { actions : [ "favoriteOne" ] },
                UNFAVORITE : { actions : [ "unfavoriteOne" ] }
            }
        },
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
                ({ url, name }) => {
                    const id = getIdFromUrl(url);
                    return C.individualsById[id] = { name, id }
                });
        }),
        recordIndividuals: assign((C, E) => {
            // Unpack into existing skeleton
            E.data.forEach(({ id, sprites }) => {
                C.individualsById[id].sprites = sprites;
            })
        }),
        alertProblemWithAPI : () =>
            alert("There was a problem with the Pokemon API :("),
        favoriteOne: assign((C, E) => {
            C.individualsById[E.id].favorited = true;
        }),
        unfavoriteOne: assign((C, E) => {
            C.individualsById[E.id].favorited = false;
        }),
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
