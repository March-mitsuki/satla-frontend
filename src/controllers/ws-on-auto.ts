// local dependencies
import rootCtx from "@/components/contexts";

// type
import {
  s2cAddAutoSubBody,
  s2cChangeAutoMemoBody,
  s2cGetRoomAutoListsBody,
} from "@/interfaces/ws-auto";
import { AutoList } from "@/interfaces/autoplay";
import { s2cDeleteAutoSubBody } from "@/interfaces/ws-auto";

const { autoList, setAutoList } = rootCtx.autoplayCtx;

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
  return undefined;
};

export const deleteAutoSub = (body: s2cDeleteAutoSubBody) => {
  if (body.status) {
    setAutoList((pre) => {
      if (pre) {
        const result = pre.filter((x) => x.id !== body.list_id);
        return result;
      } else {
        window.alert("不存在该list");
        return undefined;
      }
    });
  } else {
    window.alert("删除失败, 请重试");
  }
  return undefined;
};

export const changeAutoMemo = (body: s2cChangeAutoMemoBody) => {
  if (!body.status) {
    window.alert("更改备注失败, 请刷新后重试");
    return undefined;
  }
  const dc = autoList();
  if (!dc) {
    window.alert("不存在播放列表");
    return;
  }
  const idx = dc.findIndex((x) => x.id === body.list_id);
  dc[idx].memo = body.memo;
  setAutoList(dc);
  const memoDiv = document.getElementById("autoMemoDiv") as HTMLDivElement;
  memoDiv.innerText = body.memo;
};
