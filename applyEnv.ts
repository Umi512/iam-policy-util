/*
概要：本ソースと同じディレクトリにあるenvファイルのhogeキーの値を，urlに追加する
*/

// モジュールの読み込み
import { config } from "https://deno.land/x/dotenv/mod.ts";         // 環境変数取得用

// .envファイルから環境設定値を取得し，jsonファイルのプレースホルダーを置き換える
export async function setJsonKey(filepath:string){
    try{
        let checkFlag:boolean = true;
        // 環境変数取得
        const env = config({ safe: true });
        //jsonファイルの取得
        const jsonData = await getJsonObj(filepath);
        if(!jsonData){
            throw new Error();
        }
        //プレースホルダーの置換
        checkFlag = replacePlaceHolder(jsonData,env);
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

function replacePlaceHolder(jData: Object,env: Object): boolean{
    try{
        // envのkey数分ループして${}を置き換える
        for(let eKey in env){
            for(let jKey in jData){
                //.envのキーに対応したjsonファイルのプレースホルダーの置き換え
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