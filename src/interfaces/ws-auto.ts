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

export interface c2sPlaySendBlank {
  head: {
    cmd: "playSendBlank";
  };
  body: {
    data: any; // eslint-disable-line
  };
}

export interface c2sDeleteAutoSub {
  head: {
    cmd: "deleteAutoSub";
  };
  body: {
    list_id: number;
  };
}

export interface c2sGetAutoPlayStat {
  head: {
    cmd: "getAutoPlayStat";
  };
  body: {
    data: any; // eslint-disable-line
  };
}

export interface c2sRecoverAutoPlayStat {
  head: {
    cmd: "recoverAutoPlayStat";
  };
  body: {
    data: any; // eslint-disable-line
  };
}

/**
 * 以下s2c
 */

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

export interface s2cAutoPlayEndBody {
  data: any; // eslint-disable-line
}

export interface s2cAutoPlayErrBody {
  msg: string;
}

export interface s2cAutoPreviewChangeBody {
  behind_two: AutoSub;
  behind: AutoSub;
  main: AutoSub;
  next: AutoSub;
  next_two: AutoSub;
}

export interface s2cDeleteAutoSubBody {
  status: boolean;
  list_id: number;
}

export interface s2cGetAutoPlayStatBody {
  wsroom: string;
  state: 0 | 1 | 2; // 0 -> stopped, 1 -> playing, 2 -> paused
  list_id: number;
  now_sub: AutoSub;
  preview: s2cAutoPreviewChangeBody;
}

export interface s2cRecoverPlayStatBody {
  status: boolean;
}
