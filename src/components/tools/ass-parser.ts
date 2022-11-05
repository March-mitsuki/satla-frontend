// denpendencies lib
import { parse, ParsedASSEvent } from "ass-compiler";

// type
import { AutoSub, AutoList } from "@/interfaces/autoplay";

// 默认保留小数点2位进行四舍五入
export const mathRound = (num: number, scale = 2) => {
  const _scale = Math.pow(10, scale);
  const result = Math.round(num * _scale) / _scale;
  return result;
};

// export const bufToStr = (buf: ArrayBuffer) => {

// }

// 中日双语在text中用\N进行分割
export const assSongParser_N = (assData: string, room_id: number): AutoSub[] => {
  // list_id 为 -1, 上传到服务器后由服务器添加
  const sliceStr = (str: string) => {
    const subtitle = str.slice(0, str.indexOf("\\N"));
    const origin = str.slice(str.indexOf("\\N") + 2);
    return [subtitle, origin];
  };
  const parsedAss = parse(assData);
  const assDialogue = parsedAss.events.dialogue;

  const parsedAutoSubs: AutoSub[] = [];
  for (let i = 0; i < assDialogue.length; i++) {
    const elem = assDialogue[i];
    const next_elem: ParsedASSEvent | undefined = assDialogue[i + 1];
    if (typeof next_elem !== "undefined" && mathRound(next_elem.Start - elem.End) !== 0) {
      const [subtitle, origin] = sliceStr(elem.Text.combined);
      const newAutoSub = new AutoSub({
        id: -1,
        room_id: room_id,
        list_id: -1,
        subtitle: subtitle,
        origin: origin,
        start: elem.Start,
        end: elem.End,
        duration: mathRound(elem.End - elem.Start),
      });
      parsedAutoSubs.push(newAutoSub);

      const spaceSub = new AutoSub({
        id: -1,
        room_id: room_id,
        list_id: -1,
        subtitle: "",
        origin: "",
        start: elem.Start,
        end: next_elem.End,
        duration: mathRound(next_elem.Start - elem.End),
      });
      parsedAutoSubs.push(spaceSub);
    } else {
      const [subtitle, origin] = sliceStr(elem.Text.combined);
      const newAutoSub = new AutoSub({
        id: -1,
        room_id: room_id,
        list_id: -1,
        subtitle: subtitle,
        origin: origin,
        start: elem.Start,
        end: elem.End,
        duration: mathRound(elem.End - elem.Start),
      });
      parsedAutoSubs.push(newAutoSub);
    }
  }
  return parsedAutoSubs;
};

export const assSongParser_speaker = (assData: string, room_id: number): AutoSub[] => {
  // list_id 为 -1, 上传到服务器后由服务器添加
  const parsedAss = parse(assData);
  const assDialogue = parsedAss.events.dialogue;

  const parsedAutoSubs: AutoSub[] = [];
  for (let i = 0; i < assDialogue.length; i++) {
    const elem = assDialogue[i];
    const next_elem: ParsedASSEvent | undefined = assDialogue[i + 1];
    if (typeof next_elem !== "undefined" && mathRound(next_elem.Start - elem.End) !== 0) {
      const newAutoSub = new AutoSub({
        id: -1,
        room_id: room_id,
        list_id: -1,
        subtitle: elem.Text.combined,
        origin: elem.Name,
        start: elem.Start,
        end: elem.End,
        duration: mathRound(elem.End - elem.Start),
      });
      parsedAutoSubs.push(newAutoSub);

      const spaceSub = new AutoSub({
        id: -1,
        room_id: room_id,
        list_id: -1,
        subtitle: "",
        origin: "",
        start: elem.End,
        end: next_elem.Start,
        duration: mathRound(next_elem.Start - elem.End),
      });
      parsedAutoSubs.push(spaceSub);
    } else {
      const newAutoSub = new AutoSub({
        id: -1,
        room_id: room_id,
        list_id: -1,
        subtitle: elem.Text.combined,
        origin: elem.Name,
        start: elem.Start,
        end: elem.End,
        duration: mathRound(elem.End - elem.Start),
      });
      parsedAutoSubs.push(newAutoSub);
    }
  }
  return parsedAutoSubs;
};

// 从插入subtile的时候生成setlist, 要求ass必须是按照开始时间排序的
export const setlist_from_sub = (parsedAutoSubs: AutoSub[], room_id: number) => {
  const setlist = new AutoList({
    id: -1,
    room_id: room_id,
    first_subtitle: parsedAutoSubs[0].subtitle,
    first_origin: parsedAutoSubs[0].origin,
  });
  return setlist;
};
