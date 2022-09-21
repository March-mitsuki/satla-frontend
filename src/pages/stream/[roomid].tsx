import { VideoJS } from "@/components"
import videojs from "video.js"
import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta"

import { Navi } from "@/components/pages"

const StreamPage = () => {
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
  const param = useParams<{ roomid: string }>()

  return (
    <>
      <Title>直播页面</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="shadow-lg text-xl py-3 px-5">
          <Navi current_project={param.roomid}></Navi>
        </div>
        <div class='w-full flex-initial'>
          <VideoJS {...videoJSOption}></VideoJS>
        </div>
      </div>
    </>
  );
}

export default StreamPage
