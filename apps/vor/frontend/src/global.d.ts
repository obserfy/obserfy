/// <reference types="jest-fetch-mock" />

declare module "*.svg" {
  // eslint-disable-next-line import/no-duplicates
  import { FC } from "react"

  export const ReactComponent: FC
}

declare module "*.png" {
  const content: string
  export default content
}

declare module "*.jpg" {
  const content: string
  export default content
}

declare module "*.ico" {
  const content: string
  export default content
}

declare module "*.css" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any
  export default content
}

declare const Sentry: typeof import("@sentry/browser")
