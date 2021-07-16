/* eslint-disable jsx-a11y/media-has-caption */
import Hls from "hls.js"
import { ThemeUIStyleObject } from "theme-ui"
import { FC, useEffect, useRef } from "react"
// @ts-ignore
import mux from "mux-embed"

export interface VideoPlayerProps {
  src: string
  poster?: string
  sx?: ThemeUIStyleObject
}
const VideoPlayer: FC<VideoPlayerProps> = ({ src, poster, sx }) => {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    mux.monitor("#VideoPlayer", {
      debug: false,
      data: {
        env_key:
          process.env.NODE_ENV === "development"
            ? "0pt3cncsn0aocpprvn2bntisq"
            : "i2d2c3g7o9tt3tas4svflc1ce",
        player_name: "Vor VideoPlayer",
      },
    })

    let hls: Hls
    if (video.current?.canPlayType("application/vnd.apple.mpegurl")) {
      video.current.src = src
    } else if (Hls.isSupported() && video.current) {
      hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video.current)

      mux.addHLSJS("#VideoPlayer", { hlsjs: hls, Hls })
    }

    if (video.current && video.current.paused) {
      video.current.play()
    }

    return () => {
      if (hls !== undefined) {
        hls.destroy()
      }
    }
  }, [src, video.current])

  return <video id="VideoPlayer" ref={video} controls sx={sx} poster={poster} />
}

export default VideoPlayer
