export { default as AutoBtns } from "./auto-btns";
export { default as ManualBtns } from "./manual-btns";
export { default as PauseBtns } from "./pause-btns";

export const opeBtnStyle = (color: string) => {
  return `flex items-center justify-center p-[2px] rounded-md bg-${color}-500/70 hover:bg-${color}-700/70 active:bg-${color}-500/70`;
};
