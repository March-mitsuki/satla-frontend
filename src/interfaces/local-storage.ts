import { StyleData } from "./ws";

export interface RoomStyleData {
  style: StyleData
  reversed: boolean
  bilingualSend: boolean
}

export interface StorageStyleData {
  [key: string]: RoomStyleData
}