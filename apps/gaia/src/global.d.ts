declare const mixpanel: any

declare module "formidable-serverless" {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  export * from "formidable"
}

declare module "*.svg" {
  import { FC, SVGProps, ReactSVGElement } from "react"

  const ReactComponent: FC<SVGProps<ReactSVGElement>>
  export default ReactComponent
}

declare const Canny: (method: string, data: any) => void
