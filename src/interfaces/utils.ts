import { ErrJsonRes } from ".";

type UnknownObject<T extends object> = {
  [P in keyof T]: unknown;
};

const isNotNullObject = (obj: unknown): obj is object => {
  if (typeof obj !== "object") {
    return false;
  }
  if (obj === null) {
    return false;
  }
  return true;
};

export type SubDataFromCsv = {
  ja: string;
  zh: string;
};

export const isSubDataFromCsv = (obj: unknown): obj is SubDataFromCsv => {
  if (!isNotNullObject(obj)) {
    return false;
  }
  const { ja, zh } = obj as UnknownObject<SubDataFromCsv>;
  if (typeof ja !== "string") {
    return false;
  }
  if (typeof zh !== "string") {
    return false;
  }
  return true;
};

export const isErrJsonRes = (obj: unknown): obj is ErrJsonRes => {
  if (!isNotNullObject(obj)) {
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
