import { Subtitle } from ".";
import { AutoPlayCmds, s2cAutoPlayBodyTypes } from "./ws-auto";
import { defaultOriginStyle, defaultSubtitleStyle } from "@/components/tools";

// c2s -> client to server msg

export interface c2sAddSubtitleUp {
  head: {
    cmd: "addSubtitleUp";
  };
  body: {
    pre_subtitle_id: number;
    pre_subtitle_idx: number;
    room_id: number;
    checked_by: string;
  };
}

export interface c2sAddSubtitleDown {
  head: {
    cmd: "addSubtitleDown";
  };
  body: {
    pre_subtitle_id: number;
    pre_subtitle_idx: number;
    room_id: number;
    checked_by: string;
  };
}

export interface c2sChangeSubtitle {
  head: {
    cmd: "changeSubtitle";
  };
  body: {
    // 虽然发送整个subtitle, 但是只更新checked_by, subtitle, origin三个要素
    // 之后可以考虑削减发送的数据量来进行性能提升
    subtitle: Subtitle;
  };
}

export interface c2sChangeUser {
  head: {
    cmd: "changeUser";
  };
  body: {
    uname: string; // username
  };
}

export interface c2sGetRoomSubtitles {
  head: {
    cmd: "getRoomSubtitles";
  };
  body: {
    room_id: number;
  };
}

export interface c2sEditStart {
  head: {
    cmd: "editStart";
  };
  body: {
    subtitle_id: number;
    uname: string;
  };
}

export interface c2sEditEnd {
  head: {
    cmd: "editEnd";
  };
  body: {
    subtitle_id: number;
    uname: string;
  };
}

export interface c2sAddTranslatedSubtitle {
  head: {
    cmd: "addTransSub";
  };
  body: {
    new_subtitle: Subtitle;
  };
}

export interface c2sDeleteSubtitle {
  head: {
    cmd: "deleteSubtitle";
  };
  body: {
    subtitle: Subtitle;
  };
}

export interface c2sReordrSubFront {
  head: {
    cmd: "reorderSubFront"; // 从前往后拖
  };
  body: {
    operation_user: string;
    room_id: number;
    drag_id: number;
    drop_id: number;
  };
}

export interface c2sReordrSubBack {
  head: {
    cmd: "reorderSubBack"; // 从后往前拖
  };
  body: {
    operation_user: string;
    room_id: number;
    drag_id: number;
    drop_id: number;
  };
}

export interface c2sSendSubtitle {
  head: {
    cmd: "sendSubtitle";
  };
  body: {
    subtitle: Subtitle;
  };
}

export interface c2sSendSubDirect {
  head: {
    cmd: "sendSubtitleDirect";
  };
  body: {
    subtitle: Subtitle;
  };
}

// 统一 change style, bilingual, reversed 为同一个函数
export type ChangeStyleBody = {
  subtitle: string;
  origin: string;
  bilingual: boolean;
  reversed: boolean;
};
export const defaultChangeStyleBodyData: ChangeStyleBody = {
  reversed: false,
  bilingual: true,
  subtitle: defaultSubtitleStyle,
  origin: defaultOriginStyle,
};
export interface c2sChangeStyle {
  head: {
    cmd: "changeStyle";
  };
  body: ChangeStyleBody;
}

export interface c2sGetNowRoomStyle {
  head: {
    cmd: "getNowRoomStyle";
  };
  body: {
    wsroom: string;
  };
}

export interface c2sGetNowRoomSub {
  head: {
    cmd: "getNowRoomSub";
  };
  body: {
    wsroom: string;
  };
}

export interface c2sBatchAddSubs {
  head: {
    cmd: "batchAddSubs";
  };
  body: {
    subtitles: Subtitle[];
  };
}

// 心跳用于检测连接的房间状态与type, 于onopen发送, 并在收到心跳回复后再进行下一步操作
// translate发送nomal, auto发送auto
export interface c2sHeartBeat {
  head: {
    cmd: "heartBeat";
  };
  body: {
    room_type: RoomType;
    room_id: number;
  };
}
export type RoomType = "auto" | "nomal";

// s2c -> server to client msg

type NomalCmds =
  | "sChangeUser"
  | "sGetRoomSubtitles"
  | "sAddSubtitleUp"
  | "sAddSubtitleDown"
  | "sChangeSubtitle"
  | "sEditStart"
  | "sEditEnd"
  | "sAddTransSub"
  | "sDeleteSubtitle"
  | "sReorderSubFront"
  | "sReorderSubBack"
  | "sSendSubtitle"
  | "sSendSubtitleDirect"
  | "sChangeStyle"
  | "sBatchAddSubs";

type s2cNomalBodyTypes =
  | s2cChangeUserBody
  | s2cGetRoomSubBody
  | s2cAddSubtitleBody
  | s2cChangeSubtitleBody
  | s2cEditChangeBody
  | s2cAddTranslatedSubtitleBody
  | s2cDeleteSubtitleBody
  | s2cReorderSubBody
  | s2cSendSubtitleBody
  | s2cChangeStyleBody
  | s2cBatchAddSubsBody;

export interface s2cEventMap {
  // 先用s2cEventMap判断cmd, 之后再解析body
  head: {
    cmd: NomalCmds | AutoPlayCmds | "heartBeat"; // 因为目前心跳是复读所以这里是heartBeat,前面不带服务器的s
  };
  body: s2cNomalBodyTypes | s2cAutoPlayBodyTypes | s2cHeartBeatBody;
}

export interface s2cChangeUserBody {
  users: string[];
}

export interface s2cGetRoomSubBody {
  subtitles: Subtitle[];
  order: string;
}

export interface s2cAddSubtitleBody {
  // 无论往上加还是往下加, client需要的body资料都相同
  // 只是通过不同的cmd判断是往上加还是往下加而已
  room_id: number;
  new_subtitle_id: number;
  pre_subtitle_idx: number;
  checked_by: string;
}

export interface s2cChangeSubtitleBody {
  // 更改逻辑:
  // 更改字幕 -> 修改本地subtitle -> ws send -> ws on
  status: boolean; // 当status === false的时候显示更改失败
  subtitle: Subtitle; // change subtitle的时候checked_by一定是当前用户
}

export interface s2cEditChangeBody {
  // body都一样, 只是cmd不同
  subtitle_id: number;
  uname: string;
}

export interface s2cAddTranslatedSubtitleBody {
  new_subtitle: Subtitle;
}

export interface s2cDeleteSubtitleBody {
  status: boolean; // 是否删除成功
  subtitle_id: number; // 删除的subtitle
}

export interface s2cReorderSubBody {
  // body都一样, 只是cmd不同
  // 目前的拖动逻辑分为两部分:
  //  操作拖动的人: 之后前端自行更新页面, 若服务端更新不成功, 则通知操作者刷新页面
  //  他人进行拖动: 当status为true的时候交换行
  operation_user: string;
  status: boolean; // 用于判断是否拖动成功
  drag_id: number;
  drop_id: number;
}

export interface s2cSendSubtitleBody {
  // 是否是直接发送body都相同
  status: boolean;
  subtitle: Subtitle;
}

export type s2cChangeStyleBody = ChangeStyleBody;

export type s2cGetNowRoomStyleBody = ChangeStyleBody;

export interface s2cGetNowRoomSubBody {
  subtitle: Subtitle;
}

export interface s2cBatchAddSubsBody {
  status: boolean;
}

// 目前服务端发回来的心跳不包含任何数据, 只做检查
export interface s2cHeartBeatBody {
  data: any; // eslint-disable-line
}
