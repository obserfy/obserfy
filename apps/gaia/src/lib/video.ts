import Hls from "hls.js"
import mux from "mux-embed"
import { useEffect, useRef } from "react"

export const monitor = (id: string, hls: Hls | undefined) => {
  const isDev = process.env.NODE_ENV === "development"
  mux.monitor(id, {
    debug: isDev,
    hlsjs: hls,
    Hls: hls ? Hls : undefined,
    data: {
      env_key: isDev
        ? "0pt3cncsn0aocpprvn2bntisq"
        : "i2d2c3g7o9tt3tas4svflc1ce",
      player_name: "VideoPlayer",
    },
  })
}

export const attachSource = (player: HTMLVideoElement, src: string) => {
  let hls: Hls | undefined
  if (player.canPlayType("application/vnd.apple.mpegurl")) {
    // eslint-disable-next-line no-param-reassign
    player.src = src
  } else if (Hls.isSupported()) {
    hls = new Hls()
    hls.loadSource(src)
    hls.attachMedia(player)
  }

  monitor(`#${player.id}`, hls)

  return hls
}

export const useHLS = (src: string) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const { current } = ref

    let hls: Hls | undefined
    if (current) hls = attachSource(current, src)

    return () => hls?.destroy()
  }, [src])

  return { ref }
}
