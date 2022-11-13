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
  return;
};

export const changeAutoMemo = (body: s2cChangeAutoMemoBody) => {
  if (!body.status) {
    window.alert("更改备注失败, 请刷新后重试");
    return undefined;
  }
  setAutoList((pre) => {
    if (!pre) {
      window.alert("不存在播放列表");
      return undefined;
    }
    const dc = pre;
    const idx = dc.findIndex((x) => x.id === body.list_id);
    dc[idx].memo = body.memo;
    return dc;
  });
  const memoDiv = document.getElementById(`autoMemoDiv${body.list_id}`) as HTMLDivElement;
  memoDiv.innerText = body.memo;
  return;
};

export const changeStartListBg = (listId: number) => {
  setAutoList((pre) => {
    if (!pre) {
      window.alert("不存在播放列表");
      return undefined;
    }
    const dc = JSON.parse(JSON.stringify(pre)) as AutoList[];
    const idx = dc.findIndex((x) => x.id === listId);
    dc[idx].is_sent = true;
    console.log("[change bg]: ", dc);
    return dc;
  });
  return;
};
