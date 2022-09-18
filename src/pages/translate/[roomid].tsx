import { VideoJS } from "@/components"
import videojs from "video.js"
import { Title } from "@solidjs/meta";
import { createEffect, onMount } from "solid-js";
import { useParams } from "@solidjs/router";

import { FloatingWindowX, FloatingWindow } from "@/components";

import dummySub from "@/assets/dummy-subtitles";
import { CheckArea, Navi, TranslatePane } from "@/components/pages";
// import { useSocket } from "@/components/context";
// import ws from "@/components/websocket"

// const ws = useSocket()

const TranslatePage = () => {
  const videoJSOption: videojs.PlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    liveui: true,
    autoplay: true,
    sources: [
      {
        src: "http://vvvrold.mitsuki114514.com/live/test.m3u8",
        type: "application/x-mpegURL"
      },
    ],
  }

  let ws: WebSocket;

  onMount(() => {
    const baseUrl = "ws://192.168.64.3:8080/ws/"

    const param = useParams<{
      roomid: string
    }>()
    console.log("param is:", param.roomid);

    const url = baseUrl + param.roomid
    console.log("url is:", url);

    ws = new WebSocket(url)
  })

  let timer: number; 
  createEffect(() => {
    ws.onopen = () => {
      console.log("connected");
      ws.send('hello init!')
    }
    ws.onmessage = (evt) => {
      console.log("on msg:", evt.data);
    }
    ws.onclose = () => {
      console.log("ws close");
      clearInterval(timer)
    }
    ws.onerror = (evt) => {
      console.log("ws err", evt);
    }
  })

  return (
    <>
      <Title>翻译页面</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="shadow-lg mb-2 text-xl py-3 px-5">
          <Navi></Navi>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formElem = e.currentTarget
            const input = formElem.inputValue.value
            console.log("input is:", input);
            ws.send(input)
          }}>
            <input type="text" name="inputValue" class="bg-gray-500" />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div class="flex flex-auto">
          <div class="flex flex-col">
            <FloatingWindowX
              defaultWindowSize={{
                width: 500,
              }}
              minWindowSize={{
                width: 200,
              }}
              wrapperClass="w-[500px] flex-initial mb-1"
              controllerWrapperClass="flex justify-between items-center border-x-2 border-t-2 border-gray-500 rounded-t-lg bg-neutral-800"
              floatingControlContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              }
              floatingContent={
                <div>直播源</div>
              }
              cancelControlContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              contentsWrapperClass="border-2 border-gray-500 rounded-b-sm bg-neutral-700"
              risizerClass="bg-neutral-800 border-l-2 border-t-2 border-gray-500"
            >
              <VideoJS {...videoJSOption}></VideoJS>
            </FloatingWindowX>
            <FloatingWindow
              defaultWindowSize={{
                width: 500,
                height: 100,
              }}
              minWindowSize={{
                width: 435,
                height: 80,
              }}
              wrapperClass="w-[500px] flex flex-col flex-auto"
              controllerWrapperClass="flex justify-between items-center border-x-2 border-t-2 border-gray-500 rounded-t-lg bg-neutral-800"
              floatingControlContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              }
              floatingContent={
                <div>翻译输入区</div>
              }
              cancelControlContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              contentsWrapperClass="border-2 border-gray-500 rounded-b-lg flex-auto bg-neutral-700"
              risizerClass="bg-neutral-800 border-l-2 border-t-2 border-gray-500"
            >
              <TranslatePane></TranslatePane>
            </FloatingWindow>
          </div>
          <div class="w-full">
            <CheckArea subtitles={dummySub}></CheckArea>
          </div>
        </div>
      </div>
    </>
  )
}

export default TranslatePage
