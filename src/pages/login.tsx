import { Title } from "@solidjs/meta"

const SignUpPage = () => {
  const onSubmitHandler = (
    e: Event & { currentTarget: HTMLFormElement }
  ) => {
    e.preventDefault()
    console.log("will submit");
  }

  return (
    <>
      <Title>Login</Title>
      <div class="h-full bg-neutral-700 text-white flex flex-col">
        <div class="bg-red-500/50">
          navi 
        </div>
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
                placeholder="password"
                autocomplete="current-password"
                class="
                  rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg
                  focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
                "
              />
            </label>
            <button
              type="submit"
              class="w-[100%] flex justify-center items-center mt-5 text-lg bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-lg px-5 py-2 text-white"
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