export const sleep = (msec: number) => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve(`sleep ${msec} msec`)
    }, msec);
  })
}