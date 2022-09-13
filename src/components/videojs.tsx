import videojs from "video.js";
import "video.js/dist/video-js.css";

import { createEffect, createSignal, onCleanup } from "solid-js";

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
    <div class="c-player">
      <div data-vjs-player class="c-player__screen">
        <video id={videoNodeId} class="video-js" />
      </div>
    </div>
  )
}

export default VideoJS
