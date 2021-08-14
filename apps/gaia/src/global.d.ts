declare const mixpanel: any

declare module "formidable-serverless" {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  import formidable from "formidable"

  export default formidable
}

declare module "*.svg" {
  import { FC, ReactSVGElement, SVGProps } from "react"

  const ReactComponent: FC<SVGProps<ReactSVGElement>>
  export default ReactComponent
}

declare const Canny: (method: string, data: any) => void
