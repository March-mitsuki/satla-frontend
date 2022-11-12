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

export interface c2sPlayStart {
  head: {
    cmd: "playStart";
  };
  body: {
    list_id: number;
  };
}

export interface c2sPlayEnd {
  head: {
    cmd: "playEnd";
  };
  body: {
    list_id: number;
  };
}

export interface c2sPlayForward {
  head: {
    cmd: "playForward";
  };
  body: {
    list_id: number;
  };
}

export interface c2sPlayForwardTwice {
  head: {
    cmd: "playForwardTwice";
  };
  body: {
    list_id: number;
  };
}

export interface c2sPlayRewind {
  head: {
    cmd: "playRewind";
  };
  body: {
    list_id: number;
  };
}

export interface c2sPlayRewindTwice {
  head: {
    cmd: "playRewindTwice";
  };
  body: {
    list_id: number;
  };
}

export interface c2sPlayPause {
  head: {
    cmd: "playPause";
  };
  body: {
    list_id: number;
  };
}

export interface c2sPlayRestart {
  head: {
    cmd: "playRestart";
  };
  body: {
    list_id: number;
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

export interface s2cAutoChangeSub {
  auto_sub: AutoSub;
}
