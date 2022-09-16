import { For } from "solid-js"

import type { ParentComponent } from "solid-js"
import type { Subtitle } from "@/interfaces"

const inputStyle = "flex-1 rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

const CheckArea: ParentComponent<{
  subtitles: Subtitle[]
}> = (props) => {
  const postChange = (subtitle: Subtitle) => {

  }

  const onSubmitHandler = (e: SubmitEvent & { currentTarget: HTMLFormElement}) => {
    e.stopPropagation()
    e.preventDefault()
    const formElem = e.currentTarget
    console.log("custom submit action", formElem.subtitle.value, formElem.origin.value);
  }

  const formKeyDownHander = (e: KeyboardEvent & { currentTarget: HTMLFormElement}) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const formElem = e.currentTarget
      console.log("key down", e.key);
      console.log("", formElem.subtitle.value, formElem.origin.value);
    } else {
      return
    }
  }

  const addClickHandler = (e: MouseEvent, subId: number) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("add sub:", subId);
  }

  const delClickHandler = (e: MouseEvent, subId: number) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("del sub:", subId);
  }

  return (
    <ul>
      <For each={props.subtitles}>{(elem, idx) =>
        <li>
          <form
            onKeyDown={(e) => formKeyDownHander(e)}
            onSubmit={(e) => onSubmitHandler(e)}
            class="flex px-2 gap-2 mt-2 items-center"
          >
            <div class="px-1 rounded-md bg-sky-500/75 select-none">
              14:34:54
            </div>
            <div class="px-1 rounded-md bg-orange-500/75 select-none">
              已翻译
            </div>
            <input
              type="text"
              name="subtitle"
              autocomplete="off"
              placeholder="请输入翻译"
              value={elem.subtitle}
              class={inputStyle}
            />
            <input
              type="text"
              name="origin"
              autocomplete="off"
              placeholder="请输入原文"
              value={elem.origin}
              class={inputStyle}
            />
            <button
              type="submit"
              class="rounded-md p-1 bg-green-500/70"
            >
              {/* submit btn */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </button>
            <button
              onClick={(e) => addClickHandler(e, elem.id)}
              class="rounded-md p-1 bg-amber-500/70"
            >
              {/* add btn */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </button>
            <button
              onClick={(e) => delClickHandler(e, elem.id)}
              class="rounded-md p-1 bg-red-500/70"
            >
              {/* del btn */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </form>
        </li>
      }</For>
    </ul>
  )
}

export default CheckArea
