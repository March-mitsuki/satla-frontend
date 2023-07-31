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
   1. *url must be end with `/`
2. `npm run build` build a production version
3. `cp -r dist /path/to/your/backend/root/dir` cp the static dir to your backend server

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

## 注意事项

- 现在输入只监听回车和按钮, 当 blur 的时候不更新
  - 强制大家按回车, 因为监听 blur 会导致按回车发送一次, blur 时再发送一次, 而这个发送会直接导致服务器对 db 进行操作, 所以找到解决办法之前都先用这个吧
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
  - [x] ws 连接
    - [x] 当前房间人数
    - [x] 连接显示灯
  - [ ] 切换项目功能
    - [x] 字幕分房间储存
    - [ ] 项目显示分页
  - [ ] admin
    - [ ] 查看 user 一览
    - [ ] 删除指定 user
  - [x] user control
    - [x] 修改密码
- [ ] 自动发送
  - [x] 开始, 结束
  - [x] 快进, 快退
  - [x] 暂停, 再次开始
  - [x] 发送空行
  - [x] 删除
  - [x] 行数预览
  - [ ] 本地拖动排序
  - [x] 同步服务端状态, 支持中途加入
    - 这里要注意自动发送页面使用的 subtitle 模型是 autoSub, 和同传页面不同
    - 所以需要注意使用同一个 display 画面时候的分开处理
  - [x] 修改备注
  - [x] 已播放更改颜色
- [ ] 进阶功能
  - [ ] 把所有的 ws 回复都加上一项 status 来判断是否成功
  - [x] 分房间改为一项目多房间
  - [ ] 自动发送增加单行取消已发送的功能(to do list 类似)
  - [ ] 增加删除 project 的功能
  - [ ] 增加同传页面 csv 一键导入
- [ ] 性能修复
  - [x] 改为 root 统一管理 ctx
  - [ ] 目前 deep copy 使用的是 map, 但 map 好像不是 deep copy, 所以目前有的地方使用的是手动修改 html dom, 之后可以找时间统一
  - [x] 储存当前发送, 刷新不消失(前端存或者后端存都行)
    - [x] 当前同传页面是前端存, 自动发送是后端存, 找时间统一一下
    - 校对的 memo 存在本地之外别的都已经改为了服务端储存
  - [ ] ~~把 signal 改成 store 应该能增加性能~~
  - 以 array 最外层作为的 signal 应该不用改
  - [ ] 现在 getElement 和 ref 混在, 之后需要找时间统一
  - [x] floating-window 的两个 signal 应该可以整合到一个, 因为都是一起变化的
    - [ ] 应该可以从 signal 升级到 store, 因为是以 object 作为最外围的值的
    - [ ] **目前自动播放的模式转换都没有加检测, 如果有网络不好的人同时操控那么就会出现界面不一致的情况** 比如一个人已经切换到自动了, 但另外一个人还没有收到回复, 那就会出问题

## Bug

- [x] 加行时需要一起加 floatingElem
  - [x] 可以吧 floatingElem 的成分统一到 subtitle 里面,多 nest 一个 clientProp
  - [x] 也可以吧 floatingElem 变成和 subtitle 同一级的全局 signal
  - 已解决, 但当前解决方式是分成两个 array 解决, 需要统一两个 array 的 idx, 需要代码层面保证不会出现 idx 错位
- [x] 从 translate 等带有 ws 连接的页面迁移出来时 ws 不会自动断开连接
  - [x] 应该是用的是 routes 的 LINK 的关系所以会自动 cache 到本地, 所以导致现在 server 的 check login 也出了问题, 找时候修一修
- [x] 每次新人连接都会更新别人的 subtitles, 可以改成 onopen 的时候同时发两条 cmd
  - 已解决, 分为两条 cmd, 一条 broadcast 的 addUser, 一条 castself 的 getSubtitles
- [ ] 在 send-page 加行当前是 checked 属性, 是否要更改可以再讨论
- [ ] 现在可以用 translate 的前端加入自动发送的 room
  - [ ] 加入房间时要加一个判定 room_type?, ~~或者说就一个房间里可以同时存在两种字幕~~
  - 必须加判定, 因为如果同时一个房间可以用两种前端加进去那么发送就会互相打架(因为 wsroom 是同一个)
- [x] 自动播放暂停时好像没更改 rdb 的 playstat 为暂停
- [x] 自动播放好像没更改 now subtitles
  - 已解决, 自动播放的 subtitle 和同传的 subtitle 不是同一个模型, 分开处理之后就没事了
- [ ] **ws 连接安全性漏洞** 当前 ws 没做任何安全措施, 任何人只要知道发包方式都能操作房间和 db, 非常危险
  - 修复方式: 每次 ws 进行连接前先访问一个 api, 这个 api 由当前 user session 进行验证, 验证成功后会由服务器生成一个一次性的 uuidv4 通过 https 返回给前端, 并以这个 id 为此次连接的密钥, 当连接断开时自动使这个密钥失效
