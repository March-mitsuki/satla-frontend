export const sleep = (msec: number) => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve(`sleep ${msec} msec`)
    }, msec);
  })
}

export const STORAGE_STYLE = "send_style"
export const STORAGE_MEMO = "check_memo"

export const defaultSubtitleStyle = "font-size:24px; line-height:32px; font-weight:700; text-align:center; color: white;"
export const defaultOriginStyle = "font-size:18px; line-height:24px; font-weight:700; text-align:center; color: white;"
