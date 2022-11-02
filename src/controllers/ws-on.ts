// local dependencies
import _subtitles from "@/components/contexts/subtitles";
import _currentInfo from "@/components/contexts/current-info-ctx";
import { wsSend } from ".";
import { sleep } from "@/components/tools";

// type
import { Subtitle } from "@/interfaces";
import { AttachedInfo } from "@/interfaces";
import type {
  s2cEventMap,
  s2cChangeUserBody,
  s2cGetRoomSubBody,
  s2cEditChangeBody,
  s2cAddTranslatedSubtitleBody,
  s2cAddSubtitleBody,
  s2cChangeSubtitleBody,
} from "@/interfaces/ws";
import type { Setter } from "solid-js";

const { subtitles, setSubtitles, attachedInfo, setAttachedInfo } = _subtitles;

export const addUser = (data: s2cEventMap, setUserList: Setter<string[]>) => {
  const body: s2cChangeUserBody = data.body;
  setUserList(body.users);
  console.log("add user msg: ", body);
};

export const getRoomSubtitles = async (data: s2cEventMap) => {
  const body: s2cGetRoomSubBody = data.body;
  console.log("get room subtitles msg: ", body);
  const _orderList = body.order.split(",");
  const orderList = _orderList.slice(1, -1);
  body.subtitles.sort((a, b) => {
    return orderList.indexOf(a.id.toString()) - orderList.indexOf(b.id.toString());
  });
  const attachedInfo: AttachedInfo[] = [];
  for (let i = 0; i < (body.subtitles as Subtitle[]).length; i++) {
    const elem = (body.subtitles as Subtitle[])[i];
    const _attachedInfo = new AttachedInfo(elem.id);
    attachedInfo.push(_attachedInfo);
  }
  setAttachedInfo(attachedInfo);
  // await sleep(100)
  setSubtitles(body.subtitles);
};

export const changeSubtitle = (data: s2cEventMap) => {
  const body: s2cChangeSubtitleBody = data.body;
  // 无论是否更新成功都要deep copy之后进行更新, 所以先map并不会造成性能损失
  const dc_attachedInfo = attachedInfo()?.map((x) => x);
  if (!dc_attachedInfo) {
    return;
  }
  const idx = dc_attachedInfo.findIndex((elem) => elem.id === body.subtitle.id);
  if (!body.status) {
    if (body.subtitle.checked_by === _currentInfo.currentUser().user_name) {
      // 如果操作不成功并且进行操作的是自己, 那么则通知此行操作不成功
      dc_attachedInfo[idx].changeStatus = 2;
      setAttachedInfo(dc_attachedInfo);
    }
    // 如果操作不成功但不是自己进行操作, 那么不更新任何东西
  } else {
    if (dc_attachedInfo[idx].changeStatus === 2 || 1) {
      // 如果成功并且change status还在未提交或者不成功, 那么设置为普通
      dc_attachedInfo[idx].changeStatus = 0;
      setAttachedInfo(dc_attachedInfo);
    }
    if (body.subtitle.checked_by !== _currentInfo.currentUser().user_name) {
      // 如果成功并且进行操作的人是别人, 那么同时更新subtitle
      const dc_subtitles = subtitles()?.map((x) => x);
      if (!dc_subtitles) {
        return;
      }
      dc_subtitles[idx].subtitle = body.subtitle.subtitle;
      dc_subtitles[idx].origin = body.subtitle.origin;
      dc_subtitles[idx].checked_by = body.subtitle.checked_by;
      setSubtitles(dc_subtitles);
      // 更新subtitles之后只会反应checked_by不知道为什么
      const currentForm = document.getElementById(`${body.subtitle.id}-form`);
      (currentForm as HTMLFormElement).subtitle.value = body.subtitle.subtitle;
      (currentForm as HTMLFormElement).origin.value = body.subtitle.origin;
    }
  }
};

export const addSubtitleUp = (data: s2cEventMap) => {
  const body: s2cAddSubtitleBody = data.body;
  const newSub: Subtitle = new Subtitle({
    id: body.new_subtitle_id,
    project_id: body.project_id,
    checked_by: body.checked_by,
    translated_by: body.checked_by,
  });
  const newattachedInfo = new AttachedInfo(body.new_subtitle_id);
  newattachedInfo.id = newSub.id;

  attachedInfo()?.splice(body.pre_subtitle_idx, 0, newattachedInfo);
  setAttachedInfo(attachedInfo()?.map((x) => x));

  subtitles()?.splice(body.pre_subtitle_idx, 0, newSub);
  setSubtitles(subtitles()?.map((x) => x));
};

export const addSubtitleDown = (data: s2cEventMap) => {
  const body: s2cAddSubtitleBody = data.body;
  const newSub: Subtitle = new Subtitle({
    id: body.new_subtitle_id,
    project_id: body.project_id,
    checked_by: body.checked_by,
    translated_by: body.checked_by,
  });
  const newattachedInfo = new AttachedInfo(body.new_subtitle_id);
  newattachedInfo.id = newSub.id;

  attachedInfo()?.splice(body.pre_subtitle_idx + 1, 0, newattachedInfo);
  setAttachedInfo(attachedInfo()?.map((x) => x));

  subtitles()?.splice(body.pre_subtitle_idx + 1, 0, newSub);
  setSubtitles(subtitles()?.map((x) => x));
};

export const editStart = (data: s2cEventMap) => {
  const body: s2cEditChangeBody = data.body;
  const idx = attachedInfo()?.findIndex((elem) => elem.id === body.subtitle_id);
  if (typeof idx === "undefined") {
    return;
  }
  const dc_attachedInfo = attachedInfo()?.map((x) => x);
  if (!dc_attachedInfo) {
    return;
  }
  dc_attachedInfo[idx].isEditing = true;
  dc_attachedInfo[idx].editingUser = body.uname;
  setAttachedInfo(dc_attachedInfo);
};

export const editEnd = (data: s2cEventMap) => {
  const body: s2cEditChangeBody = data.body;
  const idx = attachedInfo()?.findIndex((elem) => elem.id === body.subtitle_id);
  if (typeof idx === "undefined") {
    return;
  }
  const dc_attachedInfo = attachedInfo()?.map((x) => x);
  if (!dc_attachedInfo) {
    return;
  }
  dc_attachedInfo[idx].isEditing = false;
  dc_attachedInfo[idx].editingUser = body.uname;
  setAttachedInfo(dc_attachedInfo);
};

export const addTranslatedSub = (data: s2cEventMap) => {
  const body: s2cAddTranslatedSubtitleBody = data.body;
  const newAttachedInfo = new AttachedInfo(body.new_subtitle.id);
  attachedInfo()?.push(newAttachedInfo);
  setAttachedInfo(attachedInfo()?.map((x) => x));
  subtitles()?.push(body.new_subtitle);
  setSubtitles(subtitles()?.map((x) => x));
};

export const deleteSubtitle = (id: number) => {
  setSubtitles(subtitles()?.filter((elem) => elem.id !== id));
  setAttachedInfo(attachedInfo()?.filter((elem) => elem.id !== id));
};

export const reorderSubFrontOther = ({
  drag_id,
  drop_id,
}: {
  drag_id: number;
  drop_id: number;
}) => {
  const idx = subtitles()?.findIndex((elem) => elem.id === drag_id);
  const reorderIdx = subtitles()?.findIndex((elem) => elem.id === drop_id);
  if (typeof idx === "undefined" || typeof reorderIdx === "undefined") {
    return;
  }

  const dc_attachedInfo = attachedInfo()?.map((x) => x);
  if (!dc_attachedInfo) {
    return;
  }
  dc_attachedInfo[idx].zIndex = "auto";
  dc_attachedInfo[idx].position = "static";
  dc_attachedInfo[idx].isFloating = false;
  dc_attachedInfo[idx].y = 0;
  dc_attachedInfo[idx].isDrop = false;
  dc_attachedInfo[idx].hidden = false;
  dc_attachedInfo[reorderIdx].isDrop = false;
  dc_attachedInfo.splice(idx, 1);
  dc_attachedInfo.splice(reorderIdx - 1, 0, {
    id: (subtitles() as Subtitle[])[idx].id,
    zIndex: "auto",
    position: "static",
    isFloating: false,
    y: 0,
    hidden: false,
    isDrop: false,
    isEditing: (attachedInfo() as AttachedInfo[])[idx].isEditing,
    editingUser: (attachedInfo() as AttachedInfo[])[idx].editingUser,
    changeStatus: (attachedInfo() as AttachedInfo[])[idx].changeStatus,
  });
  setAttachedInfo(dc_attachedInfo);

  const dc_subtitles = (subtitles() as Subtitle[]).map((x) => x);
  const dragSubtitle = dc_subtitles[idx];
  dc_subtitles.splice(idx, 1);
  dc_subtitles.splice(reorderIdx - 1, 0, dragSubtitle);
  setSubtitles(dc_subtitles);
};

export const reorderSubBackOther = ({ drag_id, drop_id }: { drag_id: number; drop_id: number }) => {
  const idx = subtitles()?.findIndex((elem) => elem.id === drag_id);
  const reorderIdx = subtitles()?.findIndex((elem) => elem.id === drop_id);
  if (typeof idx === "undefined" || typeof reorderIdx === "undefined") {
    return;
  }

  const dc_attachedInfo = attachedInfo()?.map((x) => x);
  if (!dc_attachedInfo) {
    return;
  }
  dc_attachedInfo[idx].zIndex = "auto";
  dc_attachedInfo[idx].position = "static";
  dc_attachedInfo[idx].isFloating = false;
  dc_attachedInfo[idx].y = 0;
  dc_attachedInfo[idx].isDrop = false;
  dc_attachedInfo[idx].hidden = false;
  dc_attachedInfo[reorderIdx].isDrop = false;
  dc_attachedInfo.splice(idx, 1);
  dc_attachedInfo.splice(reorderIdx, 0, {
    id: (subtitles() as Subtitle[])[idx].id,
    zIndex: "auto",
    position: "static",
    isFloating: false,
    y: 0,
    hidden: false,
    isDrop: false,
    isEditing: (attachedInfo() as AttachedInfo[])[idx].isEditing,
    editingUser: (attachedInfo() as AttachedInfo[])[idx].editingUser,
    changeStatus: (attachedInfo() as AttachedInfo[])[idx].changeStatus,
  });
  setAttachedInfo(dc_attachedInfo);

  const dc_subtitles = (subtitles() as Subtitle[]).map((x) => x);
  const dragSubtitle = dc_subtitles[idx];
  dc_subtitles.splice(idx, 1);
  dc_subtitles.splice(reorderIdx, 0, dragSubtitle);
  setSubtitles(dc_subtitles);
};

export const onopen = (ws: WebSocket, roomid: string) => {
  console.log("ws connected");
  wsSend.addUser(ws);
  wsSend.getRoomSubtitles(ws, roomid);
};
