import { FloatingWindowXY } from "@/components";
import { Component, createSignal } from "solid-js";
import DisplayReview from "../display-review";

const StylePreviewPane: Component<{
  ws: WebSocket;
}> = (props) => {
  const [isPaneOpen, setIsPaneOpen] = createSignal(false);

  const getElemCoord = (
    el: Element | undefined,
  ): {
    x: number;
    y: number;
  } => {
    if (!el) {
      return { x: 0, y: 0 };
    }
    const rect = el.getBoundingClientRect();
    console.log("rect is:", rect);
    return { x: rect.x, y: rect.y };
  };

  const customCancel = () => {
    setIsPaneOpen(false);
    return;
  };

  let btnRef: HTMLButtonElement | undefined;

  return (
    <>
      <div class="flex h-full">
        <button
          ref={btnRef}
          onClick={() => setIsPaneOpen(!isPaneOpen())}
          class="flex items-center gap-1 px-2 py-1 rounded-md bg-sky-500/70 hover:bg-sky-700/70 "
        >
          {isPaneOpen() ? "关闭面板" : "预览样式"}
        </button>
      </div>
      {isPaneOpen() && (
        <FloatingWindowXY
          defaultWindowSize={{
            width: 500,
            height: 200,
          }}
          defaultPosition="absolute"
          defaultCoord={getElemCoord(btnRef)}
          minWindowSize={{
            width: 150,
            height: 80,
          }}
          wrapperClass="w-[500px] h-[226px] flex flex-col"
          controllerWrapperClass="flex justify-between items-center border-x-2 border-t-2 border-gray-500 rounded-t-lg bg-neutral-800"
          floatingControlContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          }
          floatingContent={<div class="select-none">样式预览</div>}
          cancelControlContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
          customCancel={customCancel}
          contentsWrapperClass="border-2 border-gray-500 rounded-b-lg flex-auto bg-neutral-700"
          risizerClass="bg-neutral-800 border-l-2 border-t-2 border-gray-500"
        >
          <DisplayReview type="auto" ws={props.ws}></DisplayReview>
        </FloatingWindowXY>
      )}
    </>
  );
};

export default StylePreviewPane;
