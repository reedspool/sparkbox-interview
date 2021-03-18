import { Machine } from "xstate";
import { toMatchState } from "./xstate-jest-matchers";
import * as JestMatcherUtils from "jest-matcher-utils";

expect.extend({ toMatchState });

describe("Jest custom matcher toMatchState with simple machine", () => {
    let machine;
    let state;

    const definition = {
        initial: "red",
        states: {
            red: {
                on: { TOGGLE: "green" }
            },
            green: {
                on: { TOGGLE: "red" }
            }
        }
    };

    beforeEach(() => {
        machine = Machine(definition)
            .withConfig({})
            // Supply empty context to avoid warning
            .withContext({});
        state = machine.initialState;
    })

    it("Empty string", () => {
        expect(state).not.toMatchState("");
    })

    it("Initial state", () => {
        expect(machine.initialState).toMatchState("red");
    })

    it("After transition", () => {
        state = machine.transition(state, "TOGGLE");
        expect(state).toMatchState("green");
    })

    it("Failure message", () => {
        const callContext = {
            isNot: false,
            promise: undefined,
            utils : JestMatcherUtils
        };
        const result = toMatchState.call(callContext, state, "green");
        const message = result.message();
        const messageSplit = message.split("\n");

        expect(result.pass).toBe(false);
        expect(typeof message == "string").toBe(true);
        expect(messageSplit[0]).toMatch(/\/\/ XState.State.matches/)
        expect(messageSplit[2]).toMatch(/Expected:.*green/);
        expect(messageSplit[3]).toMatch(/Received:.*red/);
    })
})

describe("Jest custom matcher toMatchState with complex machine", () => {
    let machine;
    let state;

    const definition = {
        type: "parallel",
        states:
        {
            walkSign: {
                initial: "off",
                states: {
                    off: {
                        on: { TOGGLE: "on" }
                    },
                    on: {
                        on: { TOGGLE: "off" }
                    }
                }
            },
            light: {
                initial: "red",
                states: {
                    red: {
                        on: { TOGGLE: "green" }
                    },
                    green: {
                        on: { TOGGLE: "red" }
                    }
                }
            }
        }
    };

    beforeEach(() => {
        machine = Machine(definition)
            .withConfig({})
            // Supply empty context to avoid warning
            .withContext({});
        state = machine.initialState;
    })

    it("Empty string", () => {
        expect(state).not.toMatchState("");
    })

    it("Initial state", () => {
        expect(machine.initialState).toMatchState("light.red");
        expect(machine.initialState).toMatchState("walkSign.off");
    })

    it("After transition", () => {
        state = machine.transition(state, "TOGGLE");
        expect(state).toMatchState("light.green");
        expect(state).toMatchState("walkSign.on");
    })

    it("Failure message", () => {
        const callContext = {
            isNot: false,
            promise: undefined,
            utils : JestMatcherUtils
        };
        const result = toMatchState.call(callContext, state, "green");
        const message = result.message();
        const messageSplit = message.split("\n");

        expect(result.pass).toBe(false);
        expect(typeof message == "string").toBe(true);
        expect(messageSplit[0]).toMatch(/\/\/ XState.State.matches/)
        expect(messageSplit[2]).toMatch(/Expected:.*green/);
        expect(messageSplit[3]).toMatch(/Received:.*red/);
        expect(messageSplit[3]).toMatch(/Received:.*off/);
    })
})
