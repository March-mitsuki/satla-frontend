// dependencies lib
import { Title } from "@solidjs/meta";
import { createSignal, Match, Switch } from "solid-js";

// local dependencies
import { AdminNavi } from "@/components/pages/admin";

// type
import type { SignupResponseBody } from "@/interfaces";
import type { SignupUser } from "@/interfaces/admin";
import { Modal } from "@/components";

const inputStyle =
  "flex-auto rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600";
const wrongRepeatStyle =
  "flex-auto rounded-lg bg-neutral-700 px-5 py-2 border-2 border-red-500 lg:text-lg focus:border-red focus:ring-0 focus:outline-0 focus:bg-neutral-600";

const SignUpPage = () => {
  const api_base_url = import.meta.env.VITE_API_BASE_URL;

  const [repeatOK, setRepeatOK] = createSignal(true);
  const [confirm, setConfirm] = createSignal(false);
  const [isErr, setIsErr] = createSignal<{
    status: boolean;
    msg: string;
  }>({
    status: false,
    msg: "",
  });

  const poster = async (user: SignupUser): Promise<Response> => {
    const url = api_base_url + "api/admin/new_user";
    const postData = new TextEncoder().encode(JSON.stringify(user));
    console.log("will post", user);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData,
      redirect: "follow",
    });
    return response;
  };

  const submitForm = () => {
    const permissionNum = Number(signupFormRef?.permission.value);
    if (isNaN(permissionNum)) {
      console.log("permission NaN error");
      return;
    }
    if (permissionNum === 0 || permissionNum === 1 || permissionNum === 2) {
      console.log("permissionNum is: ", permissionNum);
    } else {
      console.log("permission is not on value");
      return;
    }
    const newUser: SignupUser = {
      user_name: signupFormRef?.username.value as string,
      email: signupFormRef?.email.value as string,
      password: signupFormRef?.password.value as string,
      permission: permissionNum,
    };
    poster(newUser)
      .then(async (res) => {
        if (res.redirected) {
          window.location.href = res.url;
        } else if (res.status === 200) {
          console.log("now status 200: ", res);
          const body = (await res.json()) as SignupResponseBody;
          console.log(body);
          if (body.code === -1) {
            switch (body.status) {
              case 4201:
                setIsErr({
                  status: true,
                  msg: "??????????????????????????????, ??????????????????",
                });
                break;
              default:
                setIsErr({
                  status: true,
                  msg: "????????????,??????????????????",
                });
                break;
            }
          }
        } else {
          window.alert("???????????????response, ?????????log");
          console.log("[err] unexpected response: ", res);
        }
      })
      .catch((err) => {
        setIsErr({
          status: true,
          msg: "????????????,??????????????????",
        });
        console.log("login post error: ", err);
      });
    setConfirm(false);
  };

  const onSubmitHandler = (e: Event & { currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const formElem = e.currentTarget;
    const password = formElem.password.value as string;
    const repeat = formElem.repeat.value as string;
    if (repeat !== password) {
      window.alert("??????????????????????????????");
      return;
    }
    setConfirm(true);
  };

  const repeatInputHandler = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const repeat = e.currentTarget.value;
    const formElem = e.currentTarget.closest("#signup-form");
    const password = (formElem as HTMLFormElement).password.value as string;
    if (repeat === password) {
      setRepeatOK(true);
    } else {
      setRepeatOK(false);
    }
  };

  const preventEnterSubmit = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  let signupFormRef: HTMLFormElement | undefined;

  return (
    <>
      <Title>Login</Title>
      <div class="h-full bg-neutral-700 text-white flex flex-col">
        <div class="shadow-lg mb-2 text-xl py-3 px-5">
          <AdminNavi />
        </div>
        <div class="flex-auto flex flex-col justify-center items-center">
          <div class="w-[30%] text-center text-2xl pb-10">??????vvvorld??????</div>
          <form
            id="signup-form"
            onSubmit={(e) => onSubmitHandler(e)}
            ref={signupFormRef}
            class="flex flex-col gap-5 items-end w-[30%]"
          >
            {isErr().status && <div class="text-red-600">{isErr().msg}</div>}
            <label class="flex flex-col w-[100%]">
              ?????????
              <input
                type="text"
                name="username"
                onKeyDown={preventEnterSubmit}
                pattern=".{1,20}"
                placeholder="1~20??????, ???????????????"
                autocomplete="off"
                class="
                  rounded-lg bg-neutral-700 px-5 py-2 border-2 border-gray-500 lg:text-lg
                  focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
                  invalid:focus:border-red-500 invalid:border-red-500
                "
              />
            </label>
            <label class="flex flex-col w-[100%]">
              ??????
              <input
                type="email"
                name="email"
                onKeyDown={preventEnterSubmit}
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
            <label class="flex flex-col w-[100%]">
              <div class="flex justify-between">
                <div>??????</div>
                <div class="text-sm">????????? _ ! @ # $ % ^ * ( ) & / . , - ???????????????</div>
              </div>
              <input
                type="password"
                name="password"
                onKeyDown={preventEnterSubmit}
                placeholder="8~24??????, ?????????????????????????????????"
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
            <label class="flex flex-col w-[100%]">
              ??????????????????
              <input
                type="password"
                name="repeat"
                onKeyDown={preventEnterSubmit}
                placeholder="?????????????????????"
                onInput={(e) => repeatInputHandler(e)}
                classList={{
                  [inputStyle]: repeatOK() === true,
                  [wrongRepeatStyle]: repeatOK() === false,
                }}
              />
            </label>
            <label class="flex flex-col w-[100%]">
              ????????????
              <select
                class="
                  bg-neutral-700 rounded-lg py-2 px-5 border-2 border-gray-500
                  focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600
                "
                name="permission"
              >
                <option value="0" selected={true}>
                  ?????????
                </option>
                <option value="1">??????</option>
                <option value="2">?????????</option>
              </select>
            </label>
            <div>*??????????????????????????????</div>
            <button
              type="submit"
              class="w-[100%] flex justify-center items-center text-lg bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-lg px-5 py-2 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
              <div class="px-1">????????????</div>
            </button>
          </form>
        </div>
        {confirm() && (
          <Modal>
            <div class="text-lg pb-3">?????????????????????????????????</div>
            <div class="border-gray-500 border-x-2 border-t-2 rounded-t-lg p-2">
              <Switch>
                <Match when={signupFormRef?.permission.value === "0"}>
                  <div>
                    ??????: <span class="text-green-500">????????????</span>
                  </div>
                </Match>
                <Match when={signupFormRef?.permission.value === "1"}>
                  <div>
                    ??????: <span class="text-orange-500">????????????</span>
                  </div>
                </Match>
                <Match when={signupFormRef?.permission.value === "2"}>
                  <div>
                    ??????: <span class="text-red-500">?????????</span>
                  </div>
                </Match>
              </Switch>
            </div>
            <div class="border-gray-500 border-2 p-2">?????????: {signupFormRef?.username.value}</div>
            <div class="border-gray-500 border-x-2 border-b-2 rounded-b-lg p-2">
              ??????: {signupFormRef?.email.value}
            </div>
            <div class="flex gap-2">
              <div
                onClick={submitForm}
                class="flex-1 mt-5 text-center text-lg bg-red-500/70 hover:bg-red-700/70 active:bg-red-500/70 rounded-lg px-2 py-1 text-white"
              >
                ??????
              </div>
              <div
                onClick={() => setConfirm(false)}
                class="flex-1 mt-5 text-center text-lg bg-green-500/70 hover:bg-green-700/70 active:bg-green-500/70 rounded-lg px-2 py-1 text-white"
              >
                ??????
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default SignUpPage;
