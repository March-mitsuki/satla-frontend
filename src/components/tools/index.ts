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

export const STORAGE_STYLE = "send_style";
export const STORAGE_MEMO = "check_memo";

export const defaultSubtitleStyle =
  "font-size:24px; line-height:32px; font-weight:700; text-align:center; color: white;";
export const defaultOriginStyle =
  "font-size:18px; line-height:24px; font-weight:700; text-align:center; color: white;";
