// dependencies lib
import { VideoJS } from "@/components";
import videojs from "video.js";
import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";

// local dependencies
import { Navi } from "@/components/pages";

const StreamPage = () => {
  const api_base_url = import.meta.env.VITE_API_BASE_URL;

  const videoJSOption: videojs.PlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    liveui: true,
    autoplay: true,
    sources: [
      {
        src: api_base_url + "live/test.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };
  const param = useParams<{ wsroom: string }>();

  return (
    <>
      <Title>直播页面</Title>
      <div class="h-full flex flex-col bg-neutral-700 text-white">
        <div class="shadow-lg text-xl py-3 px-5">
          <Navi currentProject={param.wsroom}></Navi>
        </div>
        <div class="w-full flex-initial">
          <VideoJS {...videoJSOption}></VideoJS>
        </div>
      </div>
    </>
  );
};

export default StreamPage;
