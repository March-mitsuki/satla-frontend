## vvvrold project

vite + solidjs + tailwind + typescript

## 注意事项
* 现在输入只监听回车和按钮, 当blur的时候不更新
  * 强制大家按回车, 因为监听blur会导致按回车发送一次, blur时再发送一次, 而这个发送会直接导致服务器对db进行操作, 所以找到解决办法之前都先用这个吧

## todo
- [] 把signal改成store应该能增加性能
- [] 现在getElement和ref混在, 之后需要找时间统一, 由于solidjs不使用虚拟dom, 应该用id和ref最终得到的效果是一样的
- [x] floating-window的两个signal应该可以整合到一个, 因为都是一起变化的
  - [] 应该可以从signal升级到store, 因为是以object作为最外围的值的