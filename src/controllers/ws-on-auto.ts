import { s2cAddAutoSubBody, s2cGetRoomAutoListsBody } from "@/interfaces/ws-auto";
import rootCtx from "@/components/contexts";
import { AutoList } from "@/interfaces/autoplay";

const { setAutoList } = rootCtx.autoplayCtx;

export const getRoomAutoLists = (body: s2cGetRoomAutoListsBody) => {
  if (body.status) {
    setAutoList(body.auto_lists);
  } else {
    window.alert("获取房间信息失败, 请刷新重试");
  }
  return;
};

export const addAutoSub = (body: s2cAddAutoSubBody) => {
  if (body.status) {
    setAutoList((pre) => {
      if (pre) {
        pre.push(body.new_list);
        return pre.map((x) => x);
      } else {
        const newList: AutoList[] = [body.new_list];
        return newList;
      }
    });
  } else {
    window.alert("添加ASS失败, 请重试");
  }
  return;
};
