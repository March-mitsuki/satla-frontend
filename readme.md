## vvvrold project

vite + solidjs + tailwind + typescript

backend here:

https://github.com/March-mitsuki/vvvorld

## 实现方式
* 后端使用golang处理，通信基于websocket协议:
  * 每次发包分为head与body,遵守json格式规则
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
* 在数据上roomid === project_name
  * 通过subtitles的project_id进行连接(但不设置外键)

## 注意事项
* 现在输入只监听回车和按钮, 当blur的时候不更新
  * 强制大家按回车, 因为监听blur会导致按回车发送一次, blur时再发送一次, 而这个发送会直接导致服务器对db进行操作, 所以找到解决办法之前都先用这个吧
* DBname: vvvorld
  * projects table
  * subtitles table
  * orders table
* 关于login/signup/logout
  1. 现在使用的是fetch api进行post
  1. 但是fetch api不会让浏览器redirect
  1. 所以使用js的window.location进行redirect
  1. 但是这种redirect会丢失掉很多meta情报
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
      * 现在拖动行的逻辑是前端判断从前往后还是从后往前, 所以可能出现一两行错位的情况
      * 但使用后端判断的话必须要先读后写, 不太想先读后写
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
    - [x] css控制
  - [ ] ws连接
    - [x] 当前房间人数
    - [ ] 连接显示灯
  - [ ] 切换项目功能
    - [x] 字幕分房间储存
    - [ ] 项目显示分页
- [ ] 进阶功能
  - [ ] 把signal改成store应该能增加性能
  - [ ] 现在getElement和ref混在, 之后需要找时间统一, 由于solidjs不使用虚拟dom, 应该用id和ref最终得到的效果是一样的
  - [x] floating-window的两个signal应该可以整合到一个, 因为都是一起变化的
    - [ ] 应该可以从signal升级到store, 因为是以object作为最外围的值的

## Bug
* ~~加行时需要一起加floatingElem~~ 已解决
  * ~~可以吧floatingElem的成分统一到subtitle里面,多nest一个clientProp~~
  * ~~也可以吧floatingElem变成和subtitle同一级的全局signal~~
  * 当前解决方式是分成两个array解决, 需要统一两个array的idx, 需要代码层面保证不会出现idx错位
* ~~从translate等带有ws连接的页面迁移出来时ws不会自动断开连接~~ 已解决
  * ~~应该是用的是routes的LINk的关系所以会自动cache到本地, 所以导致现在server 的check login也出了问题, 找时候修一修~~
* ~~每次新人连接都会更新别人的subtitles, 可以改成onopen的时候同时发两条cmd~~ 已解决