import { VideoJS } from "@/components"
import videojs from "video.js"

import { FloatingWindowX, FloatingWindow } from "@/components";


const TranslatePage = () => {
  const videoJSOption: videojs.PlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    autoplay: true,
    sources: [{
      src: "http://vjs.zencdn.net/v/oceans.mp4",
      type: "video/mp4"
    }],
  }

  return (
    <>
      <div class="h-full flex flex-col">
        <div class="bg-sky-100">Tool Bar</div>
        <div class="flex flex-auto">
          <div class="flex flex-col">
            <FloatingWindowX
              defaultWindowSize={{
                width: 400,
              }}
              wrapperClass="w-[400px] flex-initial"
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
                width: 400,
                height: 200,
              }}
              wrapperClass="w-[400px] flex flex-col flex-auto"
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
              <div>
                InputForm Here
              </div>
            </FloatingWindow>
          </div>
          <div class="bg-neutral-300 w-full">
            Subtitles Here
          </div>
        </div>
      </div>
    </>
  )
}

export default TranslatePage
