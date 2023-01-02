/*
概要：// .envファイルから環境設定値を取得し，jsonファイルのプレースホルダーを置き換える
*/

import { config } from "https://deno.land/x/dotenv/mod.ts";

export async function setJsonKey(filepath:string){
    try{
        let checkFlag:boolean = true;
        const env = config({ safe: true });
        const jsonData = await getJsonObj(filepath);
        if(!jsonData){
            throw new Error();
        }
        checkFlag = replaceJsonPlaceHolder(jsonData,env);
        if(!checkFlag){
            throw new Error();
        }
        console.log(jsonData);
    } catch(e) {
        //console.log(e.message);
    }
}

// jsonファイルからjsonオブジェクトを取得する関数
async function getJsonObj(filePath: string) :Object{
    try {
        return JSON.parse(await Deno.readTextFile(filePath));
    } catch(e) {
        console.log(filePath + " : " + e.message);
        return undefined;
    }
}

// jsonファイルの${}を，.env環境変数ファイルの各設定値に置き換える
function replaceJsonPlaceHolder(jData: Object,env: Object): boolean{
    try{
        for(let eKey in env){
            for(let jKey in jData){
                if("${" + eKey + "}" == jData[jKey]){
                    jData[jKey] = env[eKey];
                }
            }
        }
        return true;
    } catch(e) {
        console.log(e.message);
        return false;
    }
}