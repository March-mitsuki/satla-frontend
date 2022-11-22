const logger = (color: string) => {
  // eslint-disable-next-line
  return (name: string, ...args: any[]) => {
    const parsedArgs = args
      .map((elem) => {
        if (elem instanceof Object) {
          return JSON.stringify(elem, null, 2);
        } else {
          return JSON.stringify(elem);
        }
      })
      .join(`-`);
    return console.log(`%c[${name}]%c ${parsedArgs}`, `color: ${color}; font-weight: bold`, "");
  };
};

export const err = logger("red");
export const warn = logger("yellow");
export const nomal = logger("green");
export const info = logger("blue");
