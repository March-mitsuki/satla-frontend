import type { Subtitle } from "@/interfaces"

const subtitiles: Subtitle[] = [
  {
    input_time: Date.now(),
    send_time: null,
    project_id: 1,
    project_name: "default",
    slot: 1,
    slot_name: "default",
    translated_by: "用户A",
    checked_by: null,
    subtitle: "测试字幕,若一直显示此行则为连接服务器失败。",
    origin: "テストです。もしこの行がずっと表示されるままだとサーバーに接続に失敗することを示している。",
  },
  {
    input_time: Date.now(),
    send_time: null,
    project_id: 1,
    project_name: "default",
    slot: 1,
    slot_name: "default",
    translated_by: "用户A",
    checked_by: "用户B",
    subtitle: "此行应该显示,并且显示为被 -校对- 样式",
    origin: "Test 02",
  },
  {
    input_time: Date.now(),
    send_time: Date.now(),
    project_id: 1,
    project_name: "default",
    slot: 1,
    slot_name: "default",
    translated_by: "用户A",
    checked_by: "用户B",
    subtitle: "此行应该显示,并显示为被 -发送- 样式",
    origin: "",
  },
  {
    input_time: Date.now(),
    send_time: null,
    project_id: 1,
    project_name: "default",
    slot: 1,
    slot_name: "default",
    translated_by: "用户A",
    checked_by: "用户B",
    subtitle: "此行不应该被显示",
    origin: "",
  },
]

export default subtitiles