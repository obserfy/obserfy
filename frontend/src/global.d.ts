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

interface NavigationItem {
  id: string
  title: string
}

declare module "@rebass/forms" {
  // eslint-disable-next-line import/no-duplicates
  import { FC } from "react"
  import { BoxProps, FlexProps } from "rebass"

  export const Label: FC<FlexProps>
  export const Select: FC<BoxProps>
  export const Textarea: FC<BoxProps>
  export const Radio: FC<BoxProps>
  export const Checkbox: FC<BoxProps>
  export const Slider: FC<BoxProps>
  export const Switch: FC<BoxProps>
  export const Input: FC<BoxProps>
}

interface Navigator {
  share: any
}

declare module "gatsby-plugin-intl3" {
  // eslint-disable-next-line import/no-duplicates
  import { FC } from "react"
  import { navigate as gatsbyNavigate, GatsbyLinkProps } from "gatsby"

  export * from "react-intl"
  export const changeLocale: (locale: string) => void
  export const navigate: typeof gatsbyNavigate
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Link: FC<GatsbyLinkProps<any> & { language?: string }>
}

declare const $crisp: any