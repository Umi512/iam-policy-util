import { setJsonKey } from "/lib/applyEnv.ts";

// Simple name and function, compact form, but not configurable
Deno.test("./lib/applyEnv.ts", () => {
  const filepath = "./sample.json";
  setJsonKey(filepath);
});
