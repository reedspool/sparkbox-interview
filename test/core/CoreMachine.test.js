import * as CoreMachine from "../../core/CoreMachine";
import { Machine } from "xstate";
import { toMatchState } from "../xstate-jest-matchers";
import { individualsByName, group, individualsById } from "./PokemonMockData";
import { getIdFromUrl } from "../../core/PokemonAPI";
expect.extend({ toMatchState });

describe("Basic CoreMachine", () => {
    let machine;
    let S;
    let C;

    function transition(event) {
        S = machine.transition(S, event);
        C = S.context;
    }

    beforeEach(() => {
        machine = Machine(CoreMachine.definition)
            .withConfig(CoreMachine.config)
            // Supply empty context to avoid warning
            .withContext({});

        S = machine.initialState;
        C = S.context;
    });

    it("Can be imported", () => {
        expect(CoreMachine).toBeDefined();
    })

    it("Immediately gets group of pokemon", () => {
        expect(S).toMatchState("individuals.loadingRandom");
    })

    it("Responds to successful load of group", () => {
        // Simulate the resolving of the promise
        transition({
            type: 'done.invoke.fetchRandom',
            data: group
        })
        expect(S).toMatchState("individuals.active.loadingIndividuals");
        expect(C.group).toEqual(group.results);

        // The results should be unpacked from an array of {url,name}
        // to a map of id => { name }, to be filled in later
        const id = getIdFromUrl(C.group[0].url);
        expect(C.individualsById).toHaveProperty(""+id);
        expect(C.individualsById[id].name).toBe(C.group[0].name);
        expect(C.individualsById[id].id).toBe(id);
    })

    it("Responds to successful load of items", () => {
        // Simulate the resolving of the promise
        transition({
            type: 'done.invoke.fetchRandom',
            data: group
        })
        transition({
            type: 'UPDATE_INDIVIDUAL',
            id: 171,
            data: individualsById[171]
        })
        transition({
            type: 'done.invoke.fetchIndividuals',
            data: Object.values(individualsById)
        })
        expect(S).toMatchState("individuals.active.idle");

        // The results of the individual requests should now be unpacked into
        // the existing individualsById skeleton
        expect(C.individualsById[171]).toHaveProperty("sprites");
    })
})

describe("Favoriting", () => {
    let machine;
    let S;
    let C;

    function transition(event) {
        S = machine.transition(S, event);
        C = S.context;
    }

    beforeEach(() => {
        machine = Machine(CoreMachine.definition)
            .withConfig(CoreMachine.config)
            // Supply empty context to avoid warning
            .withContext({});

        S = machine.initialState;
        C = S.context;

        // Start each of these tests in "active" state
        transition({
            type: 'done.invoke.fetchRandom',
            data: group
        })
    });

    it("Can be favorited", () => {
        transition({
            type: "FAVORITE",
            id: 171
        })

        expect(C.individualsById[171].favorited).toBe(true);
    })

    it("Can be unfavorited", () => {
        transition({
            type: "FAVORITE",
            id: 171
        })
        transition({
            type: "UNFAVORITE",
            id: 171
        })

        expect(C.individualsById[171].favorited).toBeFalsy();
    })
})

describe("Sorting", () => {
    let machine;
    let S;
    let C;

    function transition(event) {
        S = machine.transition(S, event);
        C = S.context;
    }

    beforeEach(() => {
        machine = Machine(CoreMachine.definition)
            .withConfig(CoreMachine.config)
            // Supply empty context to avoid warning
            .withContext({});

        S = machine.initialState;
        C = S.context;

        // Start each of these tests in "active" state
        transition({
            type: 'done.invoke.fetchRandom',
            data: group
        })
    });

    it("Entries start sorted by ID", () => {
        expect(S).toMatchState("sorting.byId");
        expect(C.sortedIndividualIds).toEqual(
            Object.values(C.individualsById)
                .sort((a, b) => a.id - b.id)
                .map((item) => item.id))
    })

    it("Entries can be sorted by name", () => {
        transition("SORT_BY_NAME");
        expect(S).toMatchState("sorting.byName");
        expect(C.sortedIndividualIds).toEqual(
            Object.values(C.individualsById)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => item.id))
    })

    it("After sorting by name, entries can be sorted by ID", () => {
        transition("SORT_BY_NAME");
        transition("SORT_BY_ID");
        expect(S).toMatchState("sorting.byId");
        expect(C.sortedIndividualIds).toEqual(
            Object.values(C.individualsById)
                .sort((a, b) => a.id - b.id)
                .map((item) => item.id))
    })
})
