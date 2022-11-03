# this is satla frontend repo

use:
vite + solidjs + tailwind + typescript

overview here:
https://github.com/March-mitsuki/satla

backend here:
https://github.com/March-mitsuki/satla-backend

## how to use

1. create a file named `.env.production` in root dir
1. set up `VITE_WS_BASE_URL` and `VITE_API_BASE_URL` in `.env.production` file
1. `npm run build` build a production version
1. `cp -r dist /path/to/your/backend/root/dir` cp the static dir to your backend server

## 实现方式

- 后端使用 golang 处理，通信基于 websocket 协议:
  - 每次发包分为 head 与 body,遵守 json 格式规则

```json
{
  "head": {
    "cmd": "" // 后端会读取此词条执行对应操作, 具体规范参照src/interfaces/index.ts
  },
  "body": {
    "data": "" // 根据cmd不同body不同
  }
}
```

- 在数据上 roomid === project_name
  - 通过 subtitles 的 project_id 进行连接(但不设置外键)

## 注意事项

- 现在输入只监听回车和按钮, 当 blur 的时候不更新
  - 强制大家按回车, 因为监听 blur 会导致按回车发送一次, blur 时再发送一次, 而这个发送会直接导致服务器对 db 进行操作, 所以找到解决办法之前都先用这个吧
- DBname: vvvorld
  - projects table
  - subtitles table
  - orders table
- 关于 login/signup/logout
  1. 现在使用的是 fetch api 进行 post
  1. 但是 fetch api 不会让浏览器 redirect
  1. 所以使用 js 的 window.location 进行 redirect
  1. 但是这种 redirect 会丢失掉很多 meta 情报
  1. 具体例子具体分析可能之后要更改代码
  1. 具体可以看这里 https://qiita.com/1987yama3/items/5ff58b6195fe6c3f268b

## todo

- [ ] 基本功能
  - [x] 翻译页面
    - [x] 加行(up down)
    - [x] 修改行
    - [x] 修改显示(当别人正在修改的时候)
    - [x] 加翻译行
    - [x] 删除行
    - [x] 拖动行
      - 现在拖动行的逻辑是前端判断从前往后还是从后往前, 所以可能出现一两行错位的情况
      - 但使用后端判断的话必须要先读后写, 不太想先读后写
    - [x] 校对工具栏
      - [x] 储存到 localStoragea
  - [x] 发送页面
    - [x] 发送行
    - [x] 加行(up down)
    - [x] 修改行
    - [x] 修改显示(当别人正在修改的时候)
    - [x] 直接发送
    - [x] 删除行
    - [x] 发送空行
  - [x] 显示页面
    - [x] 基本显示
    - [x] 调换双语位置
    - [x] css 控制
      - [x] 储存到 local-storage
  - [ ] ws 连接
    - [x] 当前房间人数
    - [ ] 连接显示灯
  - [ ] 切换项目功能
    - [x] 字幕分房间储存
    - [ ] 项目显示分页
  - [ ] admin
    - [ ] 查看 user 一览
    - [ ] 删除指定 user
  - [x] user control
    - [x] 修改密码
- [ ] 进阶功能
  - [ ] 分房间改为一项目多房间
  - [ ] 支持自动发送
- [ ] 性能修复
  - [ ] 改为 root 统一管理 ctx (使用自制 redux)
  - [ ] 储存当前发送, 刷新不消失(前端存或者后端存都行)
  - [ ] 把 signal 改成 store 应该能增加性能
  - [ ] 现在 getElement 和 ref 混在, 之后需要找时间统一
  - [x] floating-window 的两个 signal 应该可以整合到一个, 因为都是一起变化的
    - [ ] 应该可以从 signal 升级到 store, 因为是以 object 作为最外围的值的

## Bug

- ~~加行时需要一起加 floatingElem~~ 已解决
  - ~~可以吧 floatingElem 的成分统一到 subtitle 里面,多 nest 一个 clientProp~~
  - ~~也可以吧 floatingElem 变成和 subtitle 同一级的全局 signal~~
  - 当前解决方式是分成两个 array 解决, 需要统一两个 array 的 idx, 需要代码层面保证不会出现 idx 错位
- ~~从 translate 等带有 ws 连接的页面迁移出来时 ws 不会自动断开连接~~ 已解决
  - ~~应该是用的是 routes 的 LINk 的关系所以会自动 cache 到本地, 所以导致现在 server 的 check login 也出了问题, 找时候修一修~~
- ~~每次新人连接都会更新别人的 subtitles, 可以改成 onopen 的时候同时发两条 cmd~~ 已解决
- 在 send-page 加行当前是 checked 属性, 是否要更改可以再讨论
