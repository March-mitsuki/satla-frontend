## vvvrold project

vite + solidjs + tailwind + typescript

## 注意事项
* 现在输入只监听回车和按钮, 当blur的时候不更新
  * 强制大家按回车, 因为监听blur会导致按回车发送一次, blur时再发送一次, 而这个发送会直接导致服务器对db进行操作, 所以找到解决办法之前都先用这个吧

## todo
- [] 基本功能
  - [] 发送页面
  - [] 切换项目功能
- [] 进阶功能
  - [] 把signal改成store应该能增加性能
  - [] 现在getElement和ref混在, 之后需要找时间统一, 由于solidjs不使用虚拟dom, 应该用id和ref最终得到的效果是一样的
  - [x] floating-window的两个signal应该可以整合到一个, 因为都是一起变化的
    - [] 应该可以从signal升级到store, 因为是以object作为最外围的值的

## Bug
* ~~加行时需要一起加floatingElem~~ 已解决
  * ~~可以吧floatingElem的成分统一到subtitle里面,多nest一个clientProp~~
  * ~~也可以吧floatingElem变成和subtitle同一级的全局signal~~
  * 当前解决方式是分成两个array解决, 需要统一两个array的idx, 需要代码层面保证不会出现idx错位