// type
import type { ParentComponent } from "solid-js"

const Modal: ParentComponent = (props) => {
  return (
    <div
      class="absolute bg-slate-500/50 flex h-full w-full justify-center items-center"
    >
      <div class="bg-slate-800 p-5 rounded-lg">
        {props.children}
      </div>
    </div>
  )
}

export default Modal
