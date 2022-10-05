// dependencies lib, videojs也用于type
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { createEffect, createSignal, onCleanup } from "solid-js";

// type
import type { Component } from "solid-js";

const VideoJS: Component<videojs.PlayerOptions> = (props) => {
  let videoNodeId: string = "videojs-player"

  const [player, setPlayer] = createSignal<videojs.Player>()

  createEffect(() => {
    console.log("create effect once")
    setPlayer(videojs(videoNodeId, props)).ready(() => {
      console.log("videojs ready!", this);
    })
    onCleanup(() => player()?.dispose())
  })

  return (
    <div data-vjs-player>
      <video id={videoNodeId} class="video-js" />
    </div>
  )
}

export default VideoJS
