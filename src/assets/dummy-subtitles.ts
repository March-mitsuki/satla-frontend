import type { Subtitle } from "@/interfaces"

const subtitiles: Subtitle[] = [
  {
    id: 1,
    input_time: "13:32:50",
    send_time: null,
    project_id: 1,
    project_name: "default",
    translated_by: "用户A",
    checked_by: null,
    subtitle: "测试字幕,若一直显示此行则为连接服务器失败。",
    origin: "テストです。もしこの行がずっと表示されるままだとサーバーに接続に失敗することを示している。",
    deleted_at: null,
  },
  {
    id: 2,
    input_time: "13:32:50",
    send_time: null,
    project_id: 1,
    project_name: "default",
    translated_by: "用户A",
    checked_by: "用户B",
    subtitle: "此行应被显示为 -校对-未发送- 样式",
    origin: "02",
    deleted_at: null,
  },
  {
    id: 3,
    input_time: "13:32:50",
    send_time: Date.now(),
    project_id: 1,
    project_name: "default",
    translated_by: "用户A",
    checked_by: "用户B",
    subtitle: "此行应该显示,并显示为被 -已校对-发送- 样式",
    origin: "03",
    deleted_at: null,
  },
  {
    id: 4,
    input_time: "13:32:50",
    send_time: null,
    project_id: 1,
    project_name: "default",
    translated_by: "用户A",
    checked_by: null,
    subtitle: "此行不应该被显示,应显示全部行,未显示行交给服务器diff掉",
    origin: "04",
    deleted_at: null,
  },
  {
    id: 5,
    input_time: "13:32:50",
    send_time: Date.now(),
    project_id: 1,
    project_name: "default",
    translated_by: "用户A",
    checked_by: null,
    subtitle: "未校对, 已发送",
    origin: "05",
    deleted_at: null,
  },
  {
    id: 6,
    input_time: "13:32:50",
    send_time: Date.now(),
    project_id: 1,
    project_name: "default",
    translated_by: "用户A",
    checked_by: null,
    subtitle: "未校对, 已发送",
    origin: "06",
    deleted_at: null,
  },
]

export default subtitiles
