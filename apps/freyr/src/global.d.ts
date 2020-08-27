// TODO: stub gatsby-theme-i18n until proper typing is released.
declare module "gatsby-theme-i18n" {
  import { Link } from "gatsby"
  type LocalizedLink<T> = Link<T>

  const LocalizedLink
  export { LocalizedLink }
}

declare module "*.svg" {
  // eslint-disable-next-line import/no-duplicates
  import { FC } from "react"

  export const ReactComponent: FC
}