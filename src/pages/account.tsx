// dependencies lib
import { createSignal } from "solid-js";

// local dependencies
import { Modal } from "@/components";
import { IndexNavi } from "@/components/pages";
import _currentInfo from "@/components/contexts/current-info-ctx"
import { logoutUser } from "@/components/tools";

// types
import { ChangePassword, ChangePassRespBody } from "@/interfaces";


const inputStyle = "flex-auto rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"
const wrongRepeatStyle = "flex-auto rounded-lg bg-neutral-700 px-5 py-2 border-2 border-red-500 lg:text-lg focus:border-red focus:ring-0 focus:outline-0 focus:bg-neutral-600"

const AccountPage = () => {
  const api_base_url = import.meta.env.VITE_API_BASE_URL

  const { currentUser } = _currentInfo
  const [repeatOK, setRepeatOK] = createSignal(true)
  const [confirm, setConfirm] = createSignal(false)
  const [isErr, setIsErr] = createSignal<{
    status: boolean,
    msg: string
  }>({
    status: false,
    msg: ""
  })

  const poster = async (user_newpass: ChangePassword) => {
    const url = api_base_url + "api/change_pass"
    const postData = new TextEncoder().encode(JSON.stringify(user_newpass))
    console.log("will post", user_newpass);
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
    const newPass: string = formElem.newPassword.value
    const repeat: string = formElem.repeat.value
    if (repeat !== newPass) {
      window.alert("两次输入的密码不一致")
      return
    }
    setConfirm(true)
  }

  const submitForm = () => {
    if (!signupFormRef) {
      return
    }
    const postData: ChangePassword = {
      id: currentUser().id,
      user_name: currentUser().user_name,
      email: currentUser().email,
      old_password: signupFormRef.oldPassword.value,
      new_password: signupFormRef.newPassword.value,
    }
    poster(postData)
      .then(async res => {
        console.log("post successful: ", res);
        const body: ChangePassRespBody = await res.json()
        if (body.code === -1) {
          switch (body.status) {
            case 5302:
              setIsErr({
                status: true,
                msg: "服务器解析出错, 请重试",
              })
              break;
            case 5305:
              setIsErr({
                status: true,
                msg: "旧密码不正确, 请重试, 多次失败请联系管理员",
              })
              break;
            default:
              setIsErr({
                status: true,
                msg: "未知错误,请刷新后重试"
              })
              break;
          }
        } else {
          const results = await logoutUser()
          if (results !== "") {
            location.href = results
          }
        }
      })
      .catch(err => {
        setIsErr({
          status: true,
          msg: "未知错误,请刷新后重试"
        })
        console.log("login post error: ", err);
      })
    setConfirm(false)
  }

  const repeatInputHandler = (
    e: InputEvent & { currentTarget: HTMLInputElement }
  ) => {
    const repeat = e.currentTarget.value
    const formElem = e.currentTarget.closest("#signup-form")
    const newPass: string = (formElem as HTMLFormElement).newPassword.value
    if (repeat === newPass) {
      setRepeatOK(true)
    } else {
      setRepeatOK(false)
    }
  }

  let signupFormRef: HTMLFormElement | undefined;

  return (
    <>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="flex justify-between items-center shadow-lg text-xl py-3 px-5">
          <IndexNavi></IndexNavi>
        </div>
        <div class="flex-auto flex flex-col justify-center items-center">
          <div class="w-[30%] text-center text-2xl pb-10">
            修改密码
          </div>
          <form
            id="signup-form"
            onSubmit={e => onSubmitHandler(e)}
            ref={signupFormRef}
            class="flex flex-col gap-5 items-end w-[30%]"
          >
            {isErr().status &&
              <div class="text-red-600">
                {isErr().msg}
              </div>
            }
            <label
              class="flex flex-col w-[100%]"
            >
              旧密码
              <input
                type="password"
                name="oldPassword"
                placeholder="请输入旧密码"
                autocomplete="current-password"
                class="
                  rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg
                  focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
                "
              />
            </label>
            <label
              class="flex flex-col w-[100%]"
            >
              <div class="flex justify-between">
                <div>
                  新密码
                </div>
                <div class="text-sm">
                  可使用 _ ! @ # $ % ^ * ( ) & / . , - 等特殊文字
                </div>
              </div>
              <input
                type="password"
                name="newPassword"
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
              再次输入新密码
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
            <div>
              *只能由管理员创建账号
            </div>
            <button
              type="submit"
              class="w-[100%] flex justify-center items-center text-lg bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-lg px-5 py-2 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div class="px-1">
                更改密码
              </div>
            </button>
          </form>
        </div>
        {confirm() &&
          <Modal>
            <div class="text-center">
              确定要修改密码吗?
            </div>
            <div class="flex gap-2">
              <button
                onClick={submitForm}
                class="flex-1 mt-5 text-center text-lg bg-red-500/70 hover:bg-red-700/70 active:bg-red-500/70 rounded-lg px-2 py-1 text-white"
              >
                确定
              </button>
              <button
                onClick={() => setConfirm(false)}
                class="flex-1 mt-5 text-center text-lg bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-lg px-2 py-1 text-white"
              >
                取消
              </button>
            </div>
          </Modal>
        }
      </div>
    </>
  )
}

export default AccountPage;
