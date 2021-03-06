import { enableFetchMocks } from 'jest-fetch-mock'
import { getOne, getRandomGroup, getIdFromUrl } from "../../core/PokemonAPI.js";
import { individualsByName, individualsById, group } from "./PokemonMockData";

enableFetchMocks();

describe("Pokemon Mock Data", () => {
    it("Individuals exist", () => {
        expect(individualsByName).toBeDefined();
    })

    it("All individuals by name have correct shape", () => {
        Object.entries(individualsByName)
            .forEach(([name, pokemon]) => {
                expect(pokemon).toBeDefined();
                expect(pokemon.name).toBe(name)
                expect(pokemon.sprites).toHaveProperty("front_shiny");
                expect(pokemon.sprites.front_shiny).toMatch(/^http/);
            })
    })

    it("All individuals by id have correct shape", () => {
        Object.entries(individualsById)
            .forEach(([id, pokemon]) => {
                expect(pokemon).toBeDefined();
                expect(pokemon.sprites).toHaveProperty("front_shiny");
                expect(pokemon.sprites.front_shiny).toMatch(/^http/);
                expect(pokemon.id).toBe(Number(id));
            })
    })

    it("Group has expected shape", () => {
        expect(Array.isArray(group.results)).toBe(true);

        group.results.forEach((item) => {
           expect(typeof item.name).toBe("string");
           expect(item.url).toMatch(/^http/);
        });
    })

    it("Group result matches inviduals by id", () => {
        group.results.forEach(({ name, url }) => {
            const id = getIdFromUrl(url);
            expect(id).toBeLessThanOrEqual(898);
            expect(id).toBeGreaterThanOrEqual(0);
            expect(individualsById[id].name).toBe(name);
            expect(individualsById[id].id).toBe(Number(id));
        });
    })
})

describe("Singular Pokemon API requests", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("Can request one Pokemon", async () => {
        const name = "farfetchd";
        fetch.mockResponseOnce(
            JSON.stringify(individualsByName[name]));
        const result = await getOne(name);
        expect(result).toBeDefined();
        expect(result.name).toBe(name)
        expect(result.sprites).toHaveProperty("front_shiny");
        expect(result.sprites.front_shiny).toMatch(/^http/);
    })

    it("Promise rejects on bad status code", async () => {
        const name = "President Joe Biden";
        let result;

        fetch.mockResponseOnce(
            { status: 404 });
        try {
            result = await getOne(name);
        } catch (error) {
            expect(error).toBeDefined();
        }

        expect(result).toBeUndefined();
    })
})

describe("Multiple Pokemon API requests", () => {
    it("Can request a list of Pokemon", async () => {
        fetch.mockResponseOnce(
            JSON.stringify(group));
        const result = await getRandomGroup(5);
        expect(result).toBeDefined();
        result.results.forEach((item) => {
           expect(typeof item.name).toBe("string");
           expect(item.url).toMatch(/^http/);
        });
    })

    it("Promise rejects on bad status code", async () => {
        let result;

        fetch.mockResponseOnce(
            { status: 404 });

        try {
            result = await getRandomGroup(1000);
        } catch (error) {
            expect(error).toBeDefined();
        }

        expect(result).toBeUndefined();
    })
})

describe("Pokemon API utilities", () => {
    it("Can request one Pokemon", async () => {
        const url = "https://pokeapi.co/api/v2/pokemon/171/";
        const result = getIdFromUrl(url);
        expect(result).toBe(171);
    })
})
