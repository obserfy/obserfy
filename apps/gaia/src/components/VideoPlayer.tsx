import { FC } from "react"
import { useHLS } from "$lib/video"

export interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
  autoplay?: boolean
}

const VideoPlayer: FC<VideoPlayerProps> = ({
  src,
  poster,
  className,
  autoplay,
}) => {
  const hls = useHLS(src)

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      id="VideoPlayer"
      ref={hls.ref}
      controls
      className={className}
      poster={poster}
      autoPlay={autoplay}
    />
  )
}

export default VideoPlayer
