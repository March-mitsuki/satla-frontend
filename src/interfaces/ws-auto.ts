import { AutoSub, AutoList } from "./autoplay";

export interface c2sAddAutoSub {
  head: {
    cmd: "addAutoSub";
  };
  body: {
    auto_subs: AutoSub[];
    memo: string;
  };
}

export interface c2sGetRoomAutoLists {
  head: {
    cmd: "getRoomAutoLists";
  };
  body: {
    room_id: number;
  };
}

// 以下 s2c

export interface s2cAddAutoSubBody {
  status: boolean;
  new_list: AutoList;
}

export interface s2cGetRoomAutoListsBody {
  status: boolean;
  auto_lists: AutoList[];
}
