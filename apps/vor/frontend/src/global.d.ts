/// <reference types="jest-fetch-mock" />

declare module "*.svg" {
  // eslint-disable-next-line import/no-duplicates
  import { FC, SVGProps } from "react"

  export const ReactComponent: FC<SVGProps<SVGElement>>
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

declare const Canny: (method: string, data: any) => void
declare const Paddle: any

interface Window {
  updateAvailable?: () => void
  __GATSBY_LOCALE?: string
}

// TODO: stub gatsby-theme-i18n until proper typing is released.
declare module "gatsby-theme-i18n" {
  import { navigate, Link } from "gatsby"
  type LocalizedLink<T> = Link<T>

  const LocalizedLink
  const useLocalization: () => { locale: string }
  export { LocalizedLink, useLocalization, navigate }
}
