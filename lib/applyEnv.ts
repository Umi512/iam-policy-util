/*
概要：// .envファイルから環境設定値を取得し，jsonファイルのプレースホルダーを置き換える
*/

import { config, DotenvConfig } from "dotenv/mod.ts";

export async function setJsonKey(filepath: string): Promise<void> {
  try {
    let checkFlag = true;
    const env: DotenvConfig = config({ safe: true });
    const jsonData: Record<string, unknown> = await getJsonObj(filepath);
    if (Object.keys(jsonData).length <= 0) {
      throw new Error();
    }
    checkFlag = replaceJsonPlaceHolder(jsonData, env);
    if (!checkFlag) {
      throw new Error();
    }
    console.log(jsonData);
  } catch {
    //console.log(e.message);
  }
}

// jsonファイルからjsonオブジェクトを取得する関数
async function getJsonObj(filePath: string): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await Deno.readTextFile(filePath));
  } catch (e) {
    console.log(filePath + " : " + e.message);
    return {};
  }
}

// jsonファイルの${}を，.env環境変数ファイルの各設定値に置き換える
function replaceJsonPlaceHolder(
  jData: Record<string, unknown>,
  env: Record<string, string>,
): boolean {
  try {
    for (const eKey in env) {
      for (const jKey in jData) {
        if ("${" + eKey + "}" == jData[jKey]) {
          jData[jKey] = env[eKey];
        }
      }
    }
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
}
/*
function replaceJsonPlaceHolder(jData: Record<string, unknown>,env: Record<string, string>): boolean{
    try{
        for(const eKey in env) {
            for(const jKey in jData) {
                if("${" + eKey + "}" == jData[jKey]) {
                    if(!isNaN(env[eKey])) {
                        jData[jKey] = Number(env[eKey]);
                    } else if(env[eKey] instanceof Array) {

                    } else {
                        jData[jKey] = env[eKey];
                    }
                }
            }
        }
        return true;
    } catch(e) {
        console.log(e.message);
        return false;
    }
}
*/
