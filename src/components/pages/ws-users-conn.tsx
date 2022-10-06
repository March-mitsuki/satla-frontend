// dependencies lib
import { For } from "solid-js"

// type
import type { Component } from "solid-js"

const WsUsers: Component<{
  userList: string[]
}> = (props) => {
  const baseStyle = "flex justify-center items-center w-10 h-10 rounded-full overflow-hidden text-sm shadow-lg"
  const listPosition = (idx: number) => {
    if (idx === 0) {
      return ""
    }
    return `absolute right-${idx * 5}`
  }
  const colors = [
    "bg-red-400", "bg-sky-600", "bg-orange-600",
    "bg-violet-600", "bg-rose-600", "bg-pink-500",
    "bg-green-600"
  ]
  const randomColor = () => {
    return Math.floor(Math.random() * colors.length)
  }
  return (
    <ul class="flex relative">
      <For each={props.userList}>{(elem, idx) =>
        <li class={`${baseStyle} ${colors[randomColor()]} ${listPosition(idx())}`}>
          {elem}
        </li>
      }</For>
    </ul>

  )
}

export default WsUsers
