import { Title } from "@solidjs/meta"
import { Link } from "@solidjs/router";

import type { LoginUser } from "@/interfaces";

const SignUpPage = () => {
  const poster = async (user: LoginUser): Promise<Response> => {
    const url = "http://192.168.64.3:8080/api/login"
    const postData = JSON.stringify(user)
    console.log("will post", user);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData,
      redirect: "follow",
    })
    return response
  }

  const onSubmitHandler = (
    e: Event & { currentTarget: HTMLFormElement }
  ) => {
    e.preventDefault()
    const formElem = e.currentTarget
    const user: LoginUser = {
      email: formElem?.email.value,
      password: formElem?.password.value,
    }
    poster(user)
      .then(res => {
        if (res.redirected) {
          console.log("redirected: ", res);
          window.location.href = res.url
        } else if (res.status === 200) {
          console.log("now status 200: ", res);
        }
      })
      .catch(err => {
        console.log("login post error: ", err);
      })
  }

  return (
    <>
      <Title>Login</Title>
      <div class="h-full bg-neutral-700 text-white flex flex-col">
        {/* <div class="bg-red-500/50">
          navi 
        </div> */}
        <div class="flex-auto flex flex-col justify-center items-center">
          <div class="w-[30%] text-center text-2xl pb-10">
            登录vvvorld
          </div>
          <form
            onSubmit={e => onSubmitHandler(e)}
            class="flex flex-col gap-5 items-end w-[30%]"
          >
            <label
              class="flex flex-col w-[100%]"
            >
              邮箱
              <input
                type="email"
                name="email"
                placeholder="email"
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
              密码
              <input
                type="password"
                name="password"
                placeholder="password"
                autocomplete="current-password"
                class="
                  rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg
                  focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
                "
              />
            </label>
            <Link
              href="/signup"
              class="underline"
            >还没有账号? 注册一个！</Link>
            <button
              type="submit"
              class="w-[100%] flex justify-center items-center text-lg bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-lg px-5 py-2 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 rotate-180">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <div>
                登录
              </div>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUpPage