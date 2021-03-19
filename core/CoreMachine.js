import { Machine } from "xstate";
import { assign } from '@xstate/immer';
import { getIdFromUrl, getOne, getRandomGroup } from "./PokemonAPI.js";
const AMOUNT = 50;

export const definition = {
    strict: true,
    id: "core",
    type: "parallel",
    states : {
        individuals : {
            initial: "loadingRandom",
            states: {
                loadingRandom: {
                    invoke: {
                        id: "fetchRandom",
                        src: "fetchRandom",
                        onDone: {
                            target: "active",
                            actions: ["recordGroup"]
                        },
                        onError: {
                            target: "#core.individuals.failure",
                            actions: ["alertProblemWithAPI"]
                        }
                    },
                },
                active: {
                    entry: [ "sortItems" ],
                    initial: "loadingIndividuals",
                    states: {
                        loadingIndividuals: {
                            invoke: {
                                id: "fetchIndividuals",
                                src: "fetchIndividuals",
                                onDone: {
                                    target: "idle"
                                },
                                onError: {
                                    target: "#core.individuals.failure",
                                    actions: ["alertProblemWithAPI"]
                                }
                            },
                            on : {
                                UPDATE_INDIVIDUAL : {
                                    actions: [ "updateIndividual" ]
                                }
                            }
                        },
                        idle: {}
                    },
                    on: {
                        FAVORITE: { actions: ["favoriteOne"] },
                        UNFAVORITE: { actions: ["unfavoriteOne"] }
                    }
                },
                failure: { type: "final" }
            },
        },
        sorting: {
            initial: "byId",
            states: {
                byId: {
                    entry: [ "setSortingFunctionById", "sortItems" ],
                    on : { SORT_BY_NAME : "byName" }
                },
                byName: {
                    entry: [ "setSortingFunctionByName", "sortItems" ],
                    on : { SORT_BY_ID : "byId" }
                }
            },
        }
    }
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
        updateIndividual: assign((C, E) => {
            C.individualsById[E.id].sprites = E.data.sprites;
        }),
        sortItems:  assign((C, E) => {
            C.sortedIndividualIds =
                Object.values(C.individualsById ?? {})
                    .sort(C.sortingFunction)
                    .map((item) => item.id);
        }),
        alertProblemWithAPI : () =>
            alert("There was a problem with the Pokemon API :("),
        favoriteOne: assign((C, E) => {
            C.individualsById[E.id].favorited = true;
        }),
        unfavoriteOne: assign((C, E) => {
            C.individualsById[E.id].favorited = false;
        }),
        setSortingFunctionById : assign((C, E) => {
            C.sortingFunction = (a, b) => a.id - b.id;
        }),
        setSortingFunctionByName : assign((C, E) => {
            C.sortingFunction = (a, b) => a.name.localeCompare(b.name);
        }),
    },
    guards : {},
    services: {
        fetchRandom : () => getRandomGroup(AMOUNT),
        fetchIndividuals : (C, E) => {
            return function (sendParent, receiveParent) {
                const promises = [];
                E.data.results.forEach(({ url }) =>
                    {
                        const id = getIdFromUrl(url);
                        promises.push(getOne(id).then((data) => {
                            sendParent({
                                type: "UPDATE_INDIVIDUAL",
                                id,
                                data
                            })
                        }));
                    })

                // Once they're all complete, then we can proceed
                Promise.all(promises).then(_ =>
                    sendParent("done.invoke.fetchIndividuals"));
            }
        }
    }
};

export const init = () => Machine(definition, config);
