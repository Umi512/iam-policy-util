/*
概要：// .envファイルから環境設定値を取得し，jsonファイルのプレースホルダーを置き換える
*/
//const envPath = "./.env.sample"; // .envファイルパス

import { config, DotenvConfig } from "dotenv/mod.ts";

// jsonDataのプレースホルダーをコンバートする
export class ConvertJsonPlaceholderByObj {
  private targetData: Record<string, unknown> | null; // 変換対象データ
  private convertParam: Record<string, unknown> | null; // 変換パラメータ
  private rtnExecConvert: { result: boolean; data: Record<string, unknown> }; // execConvert関数の戻り値
  protected myClassName: string; // クラス名
  protected errMsgList: string[]; // エラーメッセージ作成用リスト

  constructor();
  constructor(
    tData: Record<string, unknown>,
    cData: Record<string, unknown>,
  );
  constructor(
    tData?: Record<string, unknown>,
    cData?: Record<string, unknown>,
  ) {
    if (!(tData == null) && typeof tData === "object") {
      this.targetData = tData;
    } else {
      this.targetData = null;
    }
    if (!(cData == null) && typeof tData === "object") {
      this.convertParam = cData;
    } else {
      this.convertParam = null;
    }
    this.rtnExecConvert = { result: false, data: {} };
    this.myClassName = "ConvertPlaceholderJsonData";
    this.errMsgList = [];
  }

  protected setJsonObj(tData: Record<string, unknown>): boolean {
    try {
      if (tData == null || !(typeof tData === "object")) {
        throw new Error(
          "想定外のデータが設定されています => \n  data: " +
            JSON.stringify(tData),
        );
      }
      this.targetData = tData;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  protected setDotEnvObj(cData: Record<string, unknown>): boolean {
    try {
      if (cData == null || !(typeof cData === "object")) {
        throw new Error(
          "想定外のデータが設定されています => \n  data: " +
            JSON.stringify(cData),
        );
      }
      this.convertParam = cData;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  getConvertedData(): Record<string, unknown> {
    if (this.targetData == null) {
      return {};
    }
    return this.targetData;
  }
  execConvert(): Record<string, unknown> {
    try {
      this.rtnExecConvert = { result: false, data: {} };
      if (!this.preCheckConvert()) {
        throw new Error(this.errMsgList.join("\n"));
      }
      if (!this.convertProcess()) {
        throw new Error(this.errMsgList.join("\n"));
      }
      if (!this.resultCheckConvert()) {
        throw new Error(this.errMsgList.join("\n"));
      }
      this.rtnExecConvert.result = true;
      return this.rtnExecConvert;
    } catch (e) {
      this.errMsgList = [];
      console.log(e);
      return this.rtnExecConvert;
    }
  }
  private preCheckConvert(): boolean {
    if (this.targetData == null || !(typeof this.targetData === "object")) {
      this.errMsgList.push(
        "  target: 変換対象のjsonデータ, data: " +
          JSON.stringify(this.targetData),
      );
    }
    if (this.convertParam == null || !(typeof this.convertParam === "object")) {
      this.errMsgList.push(
        "  target: 変換用のパラメータデータ, data: " +
          JSON.stringify(this.convertParam),
      );
    }
    if (this.errMsgList.length > 0) {
      this.errMsgList.unshift(
        "想定外のデータが設定されています => ",
      );
      return false;
    }
    return true;
  }
  private convertProcess(): boolean {
    try {
      if (this.targetData == null || this.convertParam == null) {
        throw new Error(
          "jsonファイル，または環境変数ファイルが正常に取得できていないため変換できません",
        );
      }
      for (const cpKey in this.convertParam) {
        this.targetData = JSON.parse(
          JSON.stringify(this.targetData).replaceAll(
            "${" + cpKey + "}",
            String(this.convertParam[cpKey]).replaceAll(/"/g, "'"),
          ),
        );
      }
      for (const tdKey in this.targetData) {
        if (
          String(this.targetData[tdKey]).localeCompare("TRUE", undefined, {
            sensitivity: "base",
          }) == 0
        ) {
          //console.log("[in true] key: " + tdKey + ", value: " + this.targetData[tdKey]);
          this.targetData[tdKey] = true;
        } else if (
          String(this.targetData[tdKey]).localeCompare("FALSE", undefined, {
            sensitivity: "base",
          }) == 0
        ) {
          //console.log("[in false] key: " + tdKey + ", value: " + this.targetData[tdKey]);
          this.targetData[tdKey] = false;
        } else if (this.targetData[tdKey] == "") {
          //console.log("[in no_value] key: " + tdKey + ", value: " + this.targetData[tdKey]);
          continue;
        } else if (!isNaN(Number(this.targetData[tdKey]))) {
          //console.log("[in number] key: " + tdKey + ", value: " + this.targetData[tdKey]);
          this.targetData[tdKey] = Number(this.targetData[tdKey]);
        } else if (
          String(this.targetData[tdKey]).indexOf("[") == -1 &&
          String(this.targetData[tdKey]).indexOf("]") == -1 &&
          String(this.targetData[tdKey]).indexOf("{") == -1 &&
          String(this.targetData[tdKey]).indexOf("}") == -1
        ) {
          //console.log("[in string] key: " + tdKey + ", value: " + this.targetData[tdKey]);
          continue;
        } else {
          //console.log("[in object] key: " + tdKey + ", value: " + this.targetData[tdKey]);
          this.targetData[tdKey] = JSON.parse(
            String(this.targetData[tdKey]).replaceAll(/'/g, '"'),
          );
        }
      }
      this.rtnExecConvert.data = Object(this.targetData);
      return true;
    } catch (e) {
      this.errMsgList.push(e);
      return false;
    }
  }
  private resultCheckConvert(): boolean {
    for (const tdKey in this.targetData) {
      if (String(this.targetData[tdKey]).indexOf("${") !== -1) {
        this.errMsgList.push(
          "  key: " + tdKey + ", value: " + this.targetData[tdKey],
        );
      }
    }
    if (this.errMsgList.length > 0) {
      this.errMsgList.unshift(
        "変換できないプレースホルダーが含まれます => ",
      );
      return false;
    }
    return true;
  }
}

// jsonファイル，.envファイルのパスを指定して，jsonDataのプレースホルダーをコンバートする
export class ConvertJsonPlaceholderByDir extends ConvertJsonPlaceholderByObj {
  private targetFileDir: string; // 変換対象ファイルパス
  private convertFileDir: string; // 変換パラメータファイルパス
  protected fileExistsObj: FileExists; // ファイル存在チェック

  constructor();
  constructor(tDir?: string, cDir?: string);
  constructor(tDir?: string, cDir?: string) {
    super();
    if (tDir) {
      this.targetFileDir = tDir;
    } else {
      this.targetFileDir = "";
    }
    if (cDir) {
      this.convertFileDir = cDir;
    } else {
      this.convertFileDir = "";
    }
    this.fileExistsObj = new FileExists();
    this.myClassName = "ConvertPlaceholderJsonFileByDotEnvFile";
  }

  protected setJsonFileDir(tDir: string): void {
    this.targetFileDir = tDir;
  }
  protected setDotEnvFileDir(cDir: string): void {
    this.convertFileDir = cDir;
  }
  async importFileData(): Promise<boolean> {
    try {
      if (
        !(await this.fileExistsObj.exec([
          this.targetFileDir,
          this.convertFileDir,
        ]))
      ) {
        throw new Error("ファイルが存在しないため処理を終了します");
      }
      if (
        !this.setJsonObj(
          JSON.parse(await Deno.readTextFile(this.targetFileDir)),
        )
      ) {
        throw new Error("Jsonファイルの取り込みに失敗しました");
      }
      if (
        !this.setDotEnvObj(config({ path: this.convertFileDir }))
      ) {
        throw new Error("環境変数ファイルの取り込みに失敗しました");
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

// ファイルまたはディレクトリの存在をチェックする
export class FileExists {
  protected myClassName: string;
  protected errMsgList: string[]; // エラーメッセージ

  constructor() {
    this.myClassName = "FileExists";
    this.errMsgList = []; // エラーメッセージ作成用リスト
  }

  async exec(filePath: Array<string>): Promise<boolean> {
    try {
      if (filePath.length <= 0) {
        throw new Error(
          "Error: 指定したファイルパスのリストが空です => filepath: [" +
            JSON.stringify(filePath) + "]\n    at " + this.myClassName +
            ".exec()",
        );
      }
      (await Promise.all(
        filePath.map((fPath) => this.fileExists(fPath)),
      ))
        .forEach((result) => {
          if (!result) {
            throw new Error(
              "Error: 以下の指定したファイルが存在しません => filepath: [" +
                this.errMsgList.join(", ") + "]\n    at " + this.myClassName +
                ".exec()",
            );
          }
        });
      return true;
    } catch (e) {
      this.errMsgList = [];
      console.log(e.message);
      return false;
    }
  }
  private async fileExists(filepath: string): Promise<boolean> {
    try {
      const file = await Deno.stat(filepath);
      return file.isFile;
    } catch {
      this.errMsgList.push(filepath);
      return false;
    }
  }
}

// ConvertJsonPlaceholderByObjテスト
export async function setJsonKey1(
  filePath: string,
  envPath: string,
): Promise<Record<string, unknown>> {
  try {
    console.log("test setJsonKey1");
    const fileExistsObj = new FileExists();
    if (!(await fileExistsObj.exec([filePath, envPath]))) {
      throw new Error("ファイルの取り込みに失敗");
    }
    const jsonData: Record<string, unknown> = JSON.parse(
      await Deno.readTextFile(filePath),
    );
    const env: DotenvConfig = config({ path: envPath });
    const convertJsonPlaceholderObj = new ConvertJsonPlaceholderByObj(
      jsonData,
      env,
    );
    const convertedJsonData = convertJsonPlaceholderObj.execConvert();
    console.log(convertedJsonData.data);
    return convertedJsonData;
  } catch (e) {
    console.log(e);
    return { result: false, data: {} };
  }
}
// ConvertJsonPlaceholderByDirテスト
export async function setJsonKey2(
  filePath: string,
  envPath: string,
): Promise<Record<string, unknown>> {
  try {
    console.log("test setJsonKey2");
    const convertJsonPlaceholderDir = new ConvertJsonPlaceholderByDir(
      filePath,
      envPath,
    );
    if (!(await convertJsonPlaceholderDir.importFileData())) {
      throw new Error("ファイルの取り込みに失敗");
    }
    const convertedJsonData = convertJsonPlaceholderDir.execConvert();
    console.log(convertedJsonData.data);
    return convertedJsonData;
  } catch (e) {
    console.log(e);
    return { result: false, data: {} };
  }
}
