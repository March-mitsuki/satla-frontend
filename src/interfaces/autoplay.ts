export class AutoSub {
  // 前端用的auto subtitle
  id: number;
  room_id: number;
  list_id: number;
  subtitle: string; // 翻译
  origin: string; // 原文
  start: number;
  end: number;
  duration: number;

  constructor({
    id,
    room_id,
    list_id,
    subtitle = "",
    origin = "",
    start,
    end,
    duration = -1,
  }: {
    id: number;
    room_id: number;
    list_id: number;
    subtitle?: string;
    origin?: string;
    start: number;
    end: number;
    duration?: number;
  }) {
    this.id = id;
    this.room_id = room_id;
    this.list_id = list_id;
    this.subtitle = subtitle;
    this.origin = origin;
    this.start = start;
    this.end = end;
    this.duration = duration;
  }
}

export class AutoList {
  // auto sub的 set list
  id: number;
  room_id: number;
  first_subtitle: string; // 第一句翻译
  first_origin: string; // 第一句原文
  memo: string;
  is_sent: boolean;

  constructor({
    id,
    room_id,
    first_origin,
    first_subtitle,
    memo = "",
    is_sent = false,
  }: {
    id: number;
    room_id: number;
    first_subtitle: string;
    first_origin: string;
    memo?: string;
    is_sent?: boolean;
  }) {
    this.id = id;
    this.room_id = room_id;
    this.first_origin = first_origin;
    this.first_subtitle = first_subtitle;
    this.memo = memo;
    this.is_sent = is_sent;
  }
}

export interface PlayingStat {
  stat: 0 | 1 | 2 | 3; // 0 -> 停止, 1 -> 自动, 2 -> 暂停, 3 -> 手动
  playingID: number;
}
