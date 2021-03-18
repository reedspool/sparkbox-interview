import { Machine } from "xstate";
import { assign } from '@xstate/immer';

export const definition = {
    strict: true,
    id: "core",
    initial: "uninitialized",
    states: {
        uninitialized: {}
    },
    on: {}
};

export const config = {
    actions: {},
    guards : {}
};

export const init = () => Machine(definition, config);
