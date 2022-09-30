import { Title } from "@solidjs/meta"
import { createSignal } from "solid-js"

import type { User } from "@/interfaces"
import { Link } from "@solidjs/router"

const inputStyle = "flex-auto rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"
const wrongRepeatStyle = "flex-auto rounded-lg bg-neutral-700 px-5 py-2 border-2 border-red-500 lg:text-lg focus:border-red focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const SignUpPage = () => {
  const [repeatOK, setRepeatOK] = createSignal(true)
  const [confirm, setConfirm] = createSignal(false)

  const poster = async (user: User): Promise<Response> => {
    const url = "http://192.168.64.3:8080/api/signup"
    const postData = JSON.stringify(user)
    console.log("will post", user);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData
    })
    return response.json()
  }

  const submitForm = async () => {
    const newUser: User = {
      userName: signupFormRef?.username.value,
      email: signupFormRef?.email.value,
      password: signupFormRef?.password.value,
    }
    const response = await poster(newUser)
    console.log("response: ", response)
    setConfirm(false)
  }

  const onSubmitHandler = (
    e: Event & { currentTarget: HTMLFormElement }
  ) => {
    e.preventDefault()
    const formElem = e.currentTarget
    const password: string = formElem?.password.value
    const repeat: string = formElem?.repeat.value
    if (repeat !== password) {
      window.alert("两次输入的密码不一致")
      return
    }
    setConfirm(true)
  }

  const repeatInputHandler = (
    e: InputEvent & { currentTarget: HTMLInputElement }
  ) => {
    const repeat = e.currentTarget.value
    const formElem = e.currentTarget.closest("#signup-form")
    const password: string = (formElem as HTMLFormElement).password.value
    if (repeat === password) {
      setRepeatOK(true)
    } else {
      setRepeatOK(false)
    }
  }

  let signupFormRef: HTMLFormElement | undefined;

  return (
    <>
      <Title>Login</Title>
      <div class="h-full bg-neutral-700 text-white flex flex-col">
        {/* <div class="bg-red-500/50">
          navi 
        </div> */}
        <div class="flex-auto flex flex-col justify-center items-center">
          <div class="w-[30%] text-center text-2xl pb-10">
            注册vvvorld账号
          </div>
          <form
            id="signup-form"
            onSubmit={e => onSubmitHandler(e)}
            ref={signupFormRef}
            class="flex flex-col gap-5 items-end w-[30%]"
          >
            <label
              class="flex flex-col w-[100%]"
            >
              用户名
              <input
                type="text"
                name="username"
                pattern=".{1,10}"
                placeholder="1~10文字, 可使用中文"
                autocomplete="off"
                class="
                  rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg
                  focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
                  invalid:focus:border-red-500 invalid:border-red-500
                "
              />
            </label>
            <label
              class="flex flex-col w-[100%]"
            >
              邮箱
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                autoCapitalize="off"
                autocomplete="email"
                class="
                  rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg
                  focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
                  invalid:focus:border-red-500 invalid:border-red-500
                "
              />
            </label>
            <label
              class="flex flex-col w-[100%]"
            >
              <div class="flex justify-between">
                <div>
                  密码
                </div>
                <div class="text-sm">
                  可使用 _ ! @ # $ % ^ * ( ) & / . , - 等特殊文字
                </div>
              </div>
              <input
                type="password"
                name="password"
                placeholder="8~24文字, 可使用英数字与特殊文字"
                autoCapitalize="off"
                autocomplete="new-password"
                pattern="^[a-zA-Z0-9_!()@#$%^*&/.,-]{8,24}$"
                class="
                  rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg
                  focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
                  invalid:focus:border-red-500 invalid:border-red-500
                "
              />
            </label>
            <label
              class="flex flex-col w-[100%]"
            >
              再次输入密码
              <input
                type="password"
                name="repeat"
                placeholder="请再次输入密码"
                onInput={(e) => repeatInputHandler(e)}
                classList={{
                  [inputStyle]: repeatOK() === true,
                  [wrongRepeatStyle]: repeatOK() === false,
                }}
              />
            </label>
            <Link
              href="/login"
              class="underline"
            >已有账号? 点我直接登录!</Link>
            <button
              type="submit"
              class="w-[100%] flex justify-center items-center text-lg bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-lg px-5 py-2 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              <div class="px-1">
                注册账号
              </div>
            </button>
          </form>
        </div>
        {confirm() &&
          <div
            class="absolute bg-slate-500/50 flex h-full w-full justify-center items-center"
          >
            <div
              class="bg-slate-800 p-5 rounded-lg"
            >
              <div class="text-lg pb-3">
                确定要用这个邮箱和用户名注册吗？
              </div>
              <div class="border-gray-500 border-x-2 border-t-2 rounded-t-lg p-2">
                用户名: {signupFormRef?.username.value}
              </div>
              <div class="border-gray-500 border-2 rounded-b-lg p-2">
                邮箱: {signupFormRef?.email.value}
              </div>
              <div
                onClick={submitForm}
                class="mt-5 text-center text-lg bg-orange-500/70 hover:bg-orange-700/70 active:bg-orange-500/70 rounded-lg px-2 py-1 text-white"
              >
                确定
              </div>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default SignUpPage