export * as logger from "./logger";

import { ErrJsonRes } from "@/interfaces";

export const sleep = (msec: number) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`sleep ${msec} msec`);
    }, msec);
  });
};

export const logoutUser = async (): Promise<string> => {
  // 若成功logout则返回redirect url, 否则返回空字符串
  const api_base_url = import.meta.env.VITE_API_BASE_URL;
  const url = api_base_url + "seesion/logout";
  try {
    const res = await fetch(url, {
      method: "DELETE",
      redirect: "follow",
    });
    if (res.redirected) {
      return res.url;
    } else {
      console.log("未收到正确回复: ", res);
      return "";
    }
  } catch (err) {
    console.log("logout error: ", err);
    return "";
  }
};

// 当前未被使用
export const cancelable_sleep = (msec: number) => {
  let timeoutId: NodeJS.Timeout | null;
  let resolve: (value: unknown) => void; // eslint-disable-line
  let reject: (reason: string) => void;
  const exec = () =>
    new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        _resolve(`sleep ${msec}`);
      }, msec);
    });
  return {
    exec,
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
        reject("sleep canceled");
      }
    },
  };
};

export const popFileSelector = () => {
  return new Promise<string[]>((resolve, reject) => {
    const inputElem = document.createElement("input");
    inputElem.type = "file";
    try {
      inputElem.addEventListener("change", (e) => {
        const inputTarget = e.currentTarget as HTMLInputElement;
        if (!inputTarget.files) {
          reject("files is null");
          return;
        }
        const file = inputTarget.files[0];
        if (file.size >= 5 * 1000 * 1000) {
          reject("file is large than 5mb");
          return;
        }
        let data: string | ArrayBuffer | null;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          data = reader.result;
          if (typeof data === "string") {
            resolve([data, file.name]);
            inputElem.remove();
          } else {
            reject("data is not in type string");
            inputElem.remove();
          }
        };
      });
      inputElem.click();
    } catch (err) {
      reject(err);
      inputElem.remove();
    }
    return;
  });
};

type UnknownObject<T extends object> = {
  [P in keyof T]: unknown;
};

export const isErrJsonRes = (obj: unknown): obj is ErrJsonRes => {
  if (typeof obj !== "object") {
    return false;
  }
  if (obj === null) {
    return false;
  }
  const { code, status, msg } = obj as UnknownObject<ErrJsonRes>;
  if (code !== -1 && code !== 0) {
    return false;
  }
  if (typeof status !== "number") {
    return false;
  }
  if (typeof msg !== "string") {
    return false;
  }
  return true;
};

export const STORAGE_STYLE = "send_style";
export const STORAGE_MEMO = "check_memo";
export const STORAGE_ASS = "ass_string";

export const defaultSubtitleStyle = `font-size:24px;
line-height:32px;
font-weight:700;
text-align:center;
color: white;
text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8);`;

export const defaultOriginStyle = `font-size:24px;
line-height:32px;
font-weight:700;
text-align:center;
color: white;
text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8);`;
