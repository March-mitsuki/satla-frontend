import { createSignal, Match, Switch } from "solid-js"

import type { Component } from "solid-js"

const inputStyle = "flex-auto rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 sm:text-sm"

const TranslatePane: Component = () => {
  const [isBilingual, setIsBilingual] = createSignal(true)
  const [canOrder, setCanOrder] = createSignal(true)
  const [inputType, setInputType] = createSignal(false) // true = 发送, false = 输入 

  const onSubmitHandler = (e: SubmitEvent & { currentTarget: HTMLFormElement}) => {
    e.stopPropagation()
    e.preventDefault()
    const formElem = e.currentTarget
    console.log("custom submit action", formElem.subtitle.value, formElem.origin.value);
    formElem.subtitle.value = ""
    formElem.origin.value = ""
  }

  const bilingualToggleHandler = (e: Event & { currentTarget: HTMLInputElement }) => {
    setIsBilingual(!isBilingual())
    console.log("显示双语 change:", isBilingual());
  }

  const orderToggleHandler = (e: Event & { currentTarget: HTMLInputElement }) => {
    setCanOrder(!canOrder())
    console.log("拖动排序 change:", canOrder());
  }

  const inputToggerHandler = (e: Event & { currentTarget: HTMLInputElement }) => {
    setInputType(!inputType())
    if (inputType()) {
      console.log("发送");
    } else {
      console.log("输入");
    }
  }

  return (
    <div class="mt-1 flex flex-col gap-1">
      <div class="flex gap-2 px-1 justify-center">
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={isBilingual()}
              onChange={(e) => bilingualToggleHandler(e)}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full"></div>
            <div 
              class="
                absolute w-4 h-4 bg-white/70 rounded-full shadow
                peer-checked:translate-x-4 peer-checked:bg-blue-400
                transition drop-shadow
              "
            ></div>
          </div>
          显示双语
        </label>
        <div class="border-l-2"></div>
        <label class="flex items-center gap-1 cursor-pointer select-none">
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={canOrder()}
              onChange={(e) => orderToggleHandler(e)}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full"></div>
            <div 
              class="
                absolute w-4 h-4 bg-white/70 rounded-full shadow
                peer-checked:translate-x-4 peer-checked:bg-blue-400
                transition drop-shadow
              "
            ></div>
          </div>
          拖动排序
        </label>
        <div class="border-l-2"></div>
        <label class="flex items-center gap-2 cursor-pointer select-none">
          输入
          <div class="relative flex items-center">
            <input
              type="checkbox"
              checked={inputType()}
              onChange={(e) => inputToggerHandler(e)}
              class="peer sr-only"
            />
            <div class="w-8 h-3 bg-gray-400 rounded-full"></div>
            <div 
              class="absolute -left-1 peer-checked:translate-x-6 transition"
            >
              <Switch>
                <Match when={inputType()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-2 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 bg-red-500/75 rounded-full drop-shadow"
                  >
                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                  </svg>
                </Match>
                <Match when={!inputType()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4 bg-green-500/75 rounded-full drop-shadow"
                  >
                    <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
                  </svg>
                </Match>
              </Switch>
            </div>
          </div>
          发送
        </label>
      </div>
      <form
        onSubmit={(e) => onSubmitHandler(e)}
        class="flex gap-1 px-1"
      >
        <input
          type="text"
          name="subtitle"
          autocomplete="off"
          placeholder="请输入翻译"
          class={inputStyle}
        />
        <input
          type="text"
          name="origin"
          autocomplete="off"
          placeholder="请输入原文"
          class={inputStyle}
        />
        <button
          type="submit"
          class="bg-green-500/70 hover:bg-green-700/70 active:bg-green-500 rounded-full px-3 border-2 border-gray-300 text-white"
        >输入</button>
      </form>
    </div>
  )
}

export default TranslatePane
