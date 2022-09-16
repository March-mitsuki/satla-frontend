import { VideoJS } from "@/components"
import videojs from "video.js"
import { Title } from "@solidjs/meta";

import { FloatingWindowX, FloatingWindow } from "@/components";

import dummySub from "@/assets/dummy-subtitles";
import { CheckArea, TranslatePane } from "@/components/pages";

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

  return (
    <>
      <Title>翻译页面</Title>
      <div class="h-full flex flex-col">
        <div class="bg-sky-100">Tool Bar</div>
        <div class="flex flex-auto">
          <div class="flex flex-col">
            <FloatingWindowX
              defaultWindowSize={{
                width: 500,
              }}
              wrapperClass="w-[500px] flex-initial"
              controllerWrapperClass="flex justify-between items-center border-2 rounded-lg mb-1 bg-red-200"
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
              contentsWrapperClass="border-2 rounded-lg bg-red-200"
            >
              <VideoJS {...videoJSOption}></VideoJS>
            </FloatingWindowX>
            <FloatingWindow
              defaultWindowSize={{
                width: 500,
                height: 100,
              }}
              wrapperClass="w-[500px] flex flex-col flex-auto"
              controllerWrapperClass="flex justify-between items-center border-2 rounded-lg mb-1 bg-red-200"
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
              contentsWrapperClass="border-2 rounded-lg bg-red-200 flex-auto"
            >
              <TranslatePane></TranslatePane>
            </FloatingWindow>
          </div>
          <div class="bg-neutral-300 w-full">
            <CheckArea subtitles={dummySub}></CheckArea>
          </div>
        </div>
      </div>
    </>
  )
}

export default TranslatePage
