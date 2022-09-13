import { VideoJS } from "@/components"
import videojs from "video.js"

const StreamPage = () => {
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
    <div>
      <VideoJS {...videoJSOption}></VideoJS>
    </div>
  )
}

export default StreamPage
