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
            .forEach(([name, pokemon]) => {
                expect(pokemon).toBeDefined();
                expect(pokemon.sprites).toHaveProperty("front_shiny");
                expect(pokemon.sprites.front_shiny).toMatch(/^http/);
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
        });
    })
})

describe("Singular Pokemon API", () => {
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
})

describe("Pokemon API utilities", () => {
    it("Can request one Pokemon", async () => {
        const url = "https://pokeapi.co/api/v2/pokemon/171/";
        const result = getIdFromUrl(url);
        expect(result).toBe(171);
    })
})
