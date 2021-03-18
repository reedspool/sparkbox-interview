import { enableFetchMocks } from 'jest-fetch-mock'
import { getOne } from "../../core/PokemonAPI.js";
import { individuals } from "./PokemonMockData";

enableFetchMocks();

describe("Pokemon Mock Data", () => {
    it("Individuals exist", () => {
        expect(individuals).toBeDefined();
    })

    it("All individuals have correct shape", () => {
        Object.entries(individuals)
            .forEach(([name, pokemon]) => {
                expect(pokemon).toBeDefined();
                expect(pokemon.name).toBe(name)
                expect(pokemon.sprites).toHaveProperty("front_shiny");
                expect(pokemon.sprites.front_shiny).toMatch(/^http/);
            })
    })
})

describe("Singular Pokemon API", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("Can request one Pokemon", async () => {
        const name = "farfetchd";
        fetch.mockResponseOnce(
            JSON.stringify(individuals[name]));
        const result = await getOne(name);
        expect(result).toBeDefined();
        expect(result.name).toBe(name)
        expect(result.sprites).toHaveProperty("front_shiny");
        expect(result.sprites.front_shiny).toMatch(/^http/);
    })
})
