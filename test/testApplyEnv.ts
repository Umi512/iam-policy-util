import { setJsonKey } from "/lib/applyEnv.ts";
import { assertObjectMatch } from "testing/asserts.ts";

Deno.test("json object check", async () => {
  const filepath = "./sample.json";
  const jsonData: Record<string, unknown> = await setJsonKey(filepath);
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
