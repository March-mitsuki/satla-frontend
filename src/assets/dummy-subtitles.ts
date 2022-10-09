import type { Subtitle } from "@/interfaces"

const subtitiles: Subtitle[] = [
  {
    id: 1,
    input_time: "99:99:99",
    send_time: null,
    project_id: 1,
    translated_by: "用户A",
    checked_by: "",
    subtitle: "测试字幕, 若一直显示此行则为连接服务器失败。",
    origin: "テストです。もしこの行がずっと表示されるままだとサーバーとの接続に失敗したことを示している。",
  },
  {
    id: 2,
    input_time: "00:00:00",
    send_time: null,
    project_id: 1,
    translated_by: "用户A",
    checked_by: "用户B",
    subtitle: "If this line always display, the connection to server has failed.",
    origin: "test line",
  },
]

export default subtitiles
