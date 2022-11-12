import { createEffect, createSignal } from "solid-js";

// type
import type { Component } from "solid-js";
import { s2cEventMap } from "@/interfaces/ws";
import { s2cAutoPreviewChangeBody } from "@/interfaces/ws-auto";
import { AutoSub } from "@/interfaces/autoplay";

const afterSubPreviewStyle = "text-center text-sm truncate w-full px-2";
const subPreviewStyle = "text-center truncate w-full px-3";

const AutoPreview: Component<{
  ws: WebSocket;
}> = (props) => {
  const [preview, setPreview] = createSignal<s2cAutoPreviewChangeBody>({
    behind_two: new AutoSub({ id: -1, list_id: -1, room_id: -1, start: -1, end: -1 }),
    behind: new AutoSub({ id: -1, list_id: -1, room_id: -1, start: -1, end: -1 }),
    main: new AutoSub({
      subtitle: "尚未开始",
      origin: "尚未开始",
      id: -1,
      list_id: -1,
      room_id: -1,
      start: -1,
      end: -1,
    }),
    next: new AutoSub({ id: -1, list_id: -1, room_id: -1, start: -1, end: -1 }),
    next_two: new AutoSub({ id: -1, list_id: -1, room_id: -1, start: -1, end: -1 }),
  });

  createEffect(() => {
    props.ws.addEventListener("message", (evt) => {
      const data = JSON.parse(evt.data as string) as s2cEventMap;
      if (data.head.cmd === "autoPreviewChange") {
        const body = data.body as s2cAutoPreviewChangeBody;
        setPreview(body);
      }
    });
  });

  return (
    <div class="grid grid-cols-10 w-full gap-5 px-20 py-5 ">
      <div class="flex flex-col justify-center items-center bg-neutral-500 rounded-lg my-5 py-2 ">
        <div class={afterSubPreviewStyle}>
          {preview().behind_two.origin === "" ? "***" : preview().behind_two.origin}
        </div>
        <div class={afterSubPreviewStyle}>
          {preview().behind_two.subtitle === "" ? "***" : preview().behind_two.subtitle}
        </div>
      </div>
      <div class="col-span-2 flex flex-col justify-center items-center bg-neutral-500 rounded-lg my-4 py-2 ">
        <div class={subPreviewStyle}>
          {preview().behind.origin === "" ? "***" : preview().behind.origin}
        </div>
        <div class={subPreviewStyle}>
          {preview().behind.subtitle === "" ? "***" : preview().behind.subtitle}
        </div>
      </div>
      <div class="col-span-4 flex flex-col justify-center items-center bg-blue-400/70 rounded-lg text-xl font-bold ">
        <div class="w-full text-center truncate px-5">
          {preview().main.origin === "" ? "***" : preview().main.origin}
        </div>
        <div class="w-full text-center truncate px-5">
          {preview().main.subtitle === "" ? "***" : preview().main.subtitle}
        </div>
      </div>
      <div class="col-span-2 flex flex-col justify-center items-center bg-neutral-500 rounded-lg my-4 py-2 ">
        <div class={subPreviewStyle}>
          {preview().next.origin === "" ? "***" : preview().next.origin}
        </div>
        <div class={subPreviewStyle}>
          {preview().next.subtitle === "" ? "***" : preview().next.subtitle}
        </div>
      </div>
      <div class="flex flex-col justify-center items-center bg-neutral-500 rounded-lg my-5 py-2 ">
        <div class={afterSubPreviewStyle}>
          {preview().next_two.origin === "" ? "***" : preview().next_two.origin}
        </div>
        <div class={afterSubPreviewStyle}>
          {preview().next_two.subtitle === "" ? "***" : preview().next_two.subtitle}
        </div>
      </div>
    </div>
  );
};

export default AutoPreview;
