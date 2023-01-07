import { setJsonKey1 } from "/lib/applyEnv.ts";
import { assertObjectMatch } from "testing/asserts.ts";

Deno.test("json object check", async () => {
  const filePath = "./sample.json";
  const envPath = "./.env.sample";
  const jsonData: Record<string, unknown> = await setJsonKey1(
    filePath,
    envPath,
  );
  console.log(jsonData);
  assertObjectMatch(jsonData, {
    hoge: "1",
    hoge2: "foo",
    hoge3: "[1,2,3]",
    hoge4: "{a:1,b:foo}",
    hoge5: "[1,2,{a:1,b:foo,c:[1,2,3]}]",
    hoge6: "{a:1,b:2,c:[1,2,{a:1,b:foo}]}",
    hoge7: "true",
    hoge8: "",
  });
});
