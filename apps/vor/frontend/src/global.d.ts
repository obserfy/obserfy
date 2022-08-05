/// <reference types="jest-fetch-mock" />
declare module "mixpanel-lite" {}

declare module "browser-lang" {
  export default function track(config: {
    languages: string[]
    fallback: string
  })
}

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

declare const mixpanel: {
  track(event: string, properties: any)
  identify(id: string)
  people: {
    set: (properties?: Object) => {}
  }
}

interface Window {
  updateAvailable?: () => void
  __GATSBY_LOCALE?: string
  mixpanel: {
    track(event: string, properties: any)
    identify(id: string)
    people: {
      set: (properties?: Object) => {}
    }
  }

  chatwootSDK: any
  $chatwoot: any
  chatwootSettings: any
}

// TODO: stub gatsby-theme-i18n until proper typing is released.
declare module "gatsby-theme-i18n" {
  declare module "gatsby-theme-i18n" {
    export function LocalizedLink({
      to,
      language,
      ...props
    }: {
      [x: string]: any
      to: any
      language?: any
    }): JSX.Element
  }

  export function useLocalization(): {
    locale: string
    defaultLang: any
    prefixDefault: any
    config: any
    localizedPath: typeof localizedPath
  }
}
