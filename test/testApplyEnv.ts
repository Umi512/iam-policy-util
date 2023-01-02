import { setJsonKey } from "/lib/applyEnv.ts";
import { assertArrayContains, assertEquals } from "testing/asserts.ts";

// Simple name and function, compact form, but not configurable
Deno.test("./lib/applyEnv.ts", () => {
  const filepath = "./sample.json";
  setJsonKey(filepath);
  assertArrayContains([1, 2, 3, 4, 5, 6], [3], "Expected 3 to be in the array");
});
