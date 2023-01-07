import { setJsonKey1, setJsonKey2 } from "/lib/applyEnv.ts";
import { assertObjectMatch } from "testing/asserts.ts";

Deno.test("json object check1", async () => {
  const filePath = "./sample.json";
  const envPath = "./.env.sample";
  const jsonData: Record<string, unknown> = await setJsonKey1(
    filePath,
    envPath,
  );
  //console.log(jsonData);
  assertObjectMatch(jsonData, {
    result: true,
    data: {
      hoge: false,
      hoge2: "a + inc",
      hoge3: [1, 2, "a"],
      hoge4: { a: 1, b: "foo" },
      hoge5: [1, 2, { a: 1, b: "foo", c: [1, 2, 3] }],
      hoge6: 111,
      hoge7: "aaa",
      hoge8: "",
      hoge9: { a: 1, b: 2, c: [1, 2, { a: 1, b: "foo" }] },
    },
  });
});
Deno.test("json object check2", async () => {
  const filePath = "./sample.json";
  const envPath = "./.env.sample";
  const jsonData: Record<string, unknown> = await setJsonKey2(
    filePath,
    envPath,
  );
  //console.log(jsonData);
  assertObjectMatch(jsonData, {
    result: true,
    data: {
      hoge: false,
      hoge2: "a + inc",
      hoge3: [1, 2, "a"],
      hoge4: { a: 1, b: "foo" },
      hoge5: [1, 2, { a: 1, b: "foo", c: [1, 2, 3] }],
      hoge6: 111,
      hoge7: "aaa",
      hoge8: "",
      hoge9: { a: 1, b: 2, c: [1, 2, { a: 1, b: "foo" }] },
    },
  });
});
