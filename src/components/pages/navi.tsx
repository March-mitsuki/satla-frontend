// dependencies lib
import { Link } from "@solidjs/router";

// local dependencies
import { LogoutBtn, WsUsers, CurrentUserInfo } from ".";

// type
import { Component } from "solid-js";

const Navi: Component<{
  currentProject: string;
  userList?: string[];
}> = (props) => {
  return (
    <div class="flex justify-between">
      <div class="flex gap-5 items-center">
        <Link href="/" class="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-600 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          主页
        </Link>
        <div class="h-6 w-[2px] bg-gray-400 rounded-full" />
        <Link
          href={`/stream/${props.currentProject}`}
          class="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-600 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          直播
        </Link>
        <div class="h-6 w-[2px] bg-gray-400 rounded-full" />
        <Link
          href={`/translate/${props.currentProject}`}
          class="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-600 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          同传
        </Link>
        <div class="h-6 w-[2px] bg-gray-400 rounded-full" />
        <Link
          href={`/send/${props.currentProject}`}
          class="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-600 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
          发送
        </Link>
      </div>
      <div class="flex justify-center items-center gap-5">
        {props.userList && (
          <>
            <WsUsers userList={props.userList} />
            <div class="h-6 w-[2px] bg-gray-400 rounded-full" />
          </>
        )}
        <CurrentUserInfo />
        <div class="h-6 w-[2px] bg-gray-400 rounded-full" />
        <button
          onClick={() => {
            localStorage.clear();
            // location.reload();
          }}
          class="flex items-center gap-1 px-2 py-1 cursor-pointer rounded-md hover:bg-neutral-600 active:bg-neutral-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 13.5H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
          <div class="pl-[2px]">清空缓存</div>
        </button>
        <div class="h-6 w-[2px] bg-gray-400 rounded-full" />
        <LogoutBtn />
      </div>
    </div>
  );
};

export default Navi;
