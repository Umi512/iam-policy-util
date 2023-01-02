import {
    assertEquals,
    assertArrayContains,
} from "testing/asserts.ts";

// Simple name and function, compact form, but not configurable
Deno.test("hello world", () => {
    const x = 1 + 2;
    assertEquals(x, 3);
    assertArrayContains([1, 2, 3, 4, 5, 6], [3], "Expected 3 to be in the array");
});

// Fully fledged test definition, longer form, but configurable (see below)
Deno.test({
    name: "hello world #2",
    fn: () => {
    const x = 1 + 2;
    assertEquals(x, 3);
    },
});