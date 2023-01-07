import { setJsonKey1, setJsonKey2 } from "/lib/applyEnv.ts";

console.log("Hello World");
await setJsonKey1("./sample.json", "./.env.sample");
await setJsonKey2("./sample.json", "./.env.sample");
