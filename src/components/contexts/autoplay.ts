import { createSignal } from "solid-js";

import { AutoList } from "@/interfaces/autoplay";

export const handleAutoplay = () => {
  const [autoList, setAutoList] = createSignal<AutoList[]>([
    {
      id: -1,
      room_id: -1,
      first_origin: "如一直显示此行则代表连接服务器出错",
      first_subtitle: "请检查网络是否正常",
      memo: "若一直无法连接请联系网站管理员",
    },
    {
      id: -2,
      room_id: -1,
      first_origin: "当前房间内无自动播放",
      first_subtitle: "请上传一个ASS以开始使用自动播放",
      memo: "",
    },
  ]);
  return { autoList, setAutoList };
};
