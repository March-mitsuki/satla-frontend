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
