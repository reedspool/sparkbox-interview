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
        expect(S).toMatchState("loadingRandom");
    })

    it("Responds to successful load of group", () => {
        // Simulate the resolving of the promise
        transition({
            type: 'done.invoke.fetchRandom',
            data: group
        })
        expect(S).toMatchState("loadingIndividuals");
        expect(C.group).toEqual(group.results);

        // The results should be unpacked from an array of {url,name}
        // to a map of id => { name }, to be filled in later
        const id = getIdFromUrl(C.group[0].url);
        expect(C.individualsById).toHaveProperty(""+id);
        expect(C.individualsById[id].name).toBe(C.group[0].name);
    })

    it("Responds to successful load of items", () => {
        // Simulate the resolving of the promise
        transition({
            type: 'done.invoke.fetchRandom',
            data: group
        })
        transition({
            type: 'done.invoke.fetchIndividuals',
            data: Object.values(individualsById)
        })
        expect(S).toMatchState("active");

        // The results of the individual requests should now be unpacked into
        // the existing individualsById skeleton
        expect(C.individualsById[171]).toHaveProperty("sprites");
    })
})
