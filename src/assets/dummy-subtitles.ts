import type { Subtitle } from "@/interfaces";

const dummySubtitles: Subtitle[] = [
  {
    id: 1,
    input_time: "99:99:99",
    send_time: null,
    room_id: 1,
    translated_by: "用户A",
    checked_by: "",
    send_by: "",
    subtitle: "测试字幕, 若一直显示此行则为连接服务器失败。",
    origin:
      "テストです。もしこの行がずっと表示されるままだとサーバーとの接続に失敗したことを示している。",
  },
];

export default dummySubtitles;
