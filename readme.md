## vvvrold project

vite + solidjs + tailwind + typescript

## 注意事项
* 现在输入只监听回车和按钮, 当blur的时候不更新
  * 强制大家按回车，因为监听blur会导致按回车发送一次，blur时再发送一次，而这个发送会直接导致服务器对db进行操作，所以找到解决办法之前都先用这个吧

## todo
- [] 把signal改成store应该能增加性能