import { lazy } from "react"

const LazyVideoPlayer = lazy(() => import("./VideoPlayer"))

export default LazyVideoPlayer
