// local dependencies
import { STORAGE_ASS } from "@/components/tools";
import { assSongParser_N, assSongParser_speaker } from "@/components/tools/ass-parser";
import { popFileSelector } from "@/components/tools";
import { wsAutoSend } from "@/controllers";

// type
import { Component, createSignal } from "solid-js";
import { AutoSub } from "@/interfaces/autoplay";

const AssUploader: Component<{
  room_id: number;
  ws: WebSocket;
}> = (props) => {
  const [nowAss, setNowAss] = createSignal<string>("未选择");

  const fileInputHandler = (e: MouseEvent & { currentTarget: HTMLButtonElement }) => {
    e.preventDefault();
    popFileSelector()
      .then(([data, filename]) => {
        setNowAss(filename);
        localStorage.setItem(STORAGE_ASS, data);
      })
      .catch((err) => {
        console.log("read file:", err);
        window.alert("文件大于5mb, 无法上传");
      });
    return;
  };

  const submitHandler = (
    e: Event & {
      submitter: HTMLElement;
    } & {
      currentTarget: HTMLFormElement;
      target: Element;
    },
  ) => {
    e.preventDefault();
    const assType = Number(assTypeSelectorRef?.value);
    const assStr = localStorage.getItem(STORAGE_ASS);
    if (!memoInputRef) {
      console.log("input ref is not binded");
      return;
    }
    const memo = memoInputRef.value;
    let parsedAss: AutoSub[] | -1;
    if (isNaN(assType)) {
      window.alert("ass的类型不正确");
      return;
    }
    if (!assStr) {
      window.alert("尚未选择ass");
      return;
    }
    console.log("ass type", assType);
    if (assType === 0) {
      parsedAss = assSongParser_N(assStr, props.room_id);
    } else if (assType === 1) {
      parsedAss = assSongParser_speaker(assStr, props.room_id);
    } else {
      window.alert("ass的类型不正确");
      return;
    }
    if (typeof parsedAss === "number" && parsedAss === -1) {
      // 现在的ass-compiler不返回stderr, 不能被try catch捕捉
      // 所以parsedAss的回复目前永远不可能是 -1
      // 之后要读ass-compiler的源码之后改东西
      window.alert("非ass类型文件");
      return;
    }
    try {
      // 目前故意去读取不存在的东西触发stderr来判断是否为ass
      console.log(parsedAss[0].subtitle);
    } catch (err) {
      window.alert("非ass类型文件");
      return;
    }
    console.log("will post: ", parsedAss);
    wsAutoSend.addAutoSub({ ws: props.ws, autoSubs: parsedAss, memo: memo });
    localStorage.removeItem(STORAGE_ASS);
    setNowAss("未选择");
  };

  let assTypeSelectorRef: HTMLSelectElement | undefined;
  let memoInputRef: HTMLInputElement | undefined;

  return (
    <form onSubmit={(e) => submitHandler(e)} class="flex gap-5">
      <select
        ref={assTypeSelectorRef}
        class={
          "bg-neutral-700 rounded-lg py-2 px-5 border-2 border-gray-500 " +
          "focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600 "
        }
      >
        <option value="0" selected={true} class="text-center">
          \\N分割
        </option>
        <option value="1" class="text-center">
          说话人代替
        </option>
      </select>
      <label class="flex items-center justify-center gap-2 ">
        <div>备注</div>
        <input
          ref={memoInputRef}
          type="text"
          placeholder="memo"
          class="h-full rounded-lg bg-neutral-700 px-2 border-2 border-gray-500 focus:border-white focus:ring-0 focus:outline-0 focus:bg-neutral-600"
        />
      </label>
      <div class="flex rounded-lg border-2 border-neutral-500">
        <button
          onClick={(e) => fileInputHandler(e)}
          class="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-500 hover:bg-slate-600 active:bg-slate-700 "
        >
          选择ASS
        </button>
        <div class="flex items-center justify-center px-2 truncate w-[150px]">{nowAss()}</div>
      </div>
      <button
        type="submit"
        class="flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/70 hover:bg-orange-700/70 "
      >
        提交
      </button>
    </form>
  );
};

export default AssUploader;
