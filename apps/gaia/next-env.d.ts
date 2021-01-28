/// <reference types="next" />
/// <reference types="next/types/global" />
declare const Canny: (method: string, data: any) => void

declare const mixpanel: any

declare module "formidable-serverless" {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  export * from "formidable"
}

declare module "*.svg" {
  import { FC, SVGProps, SVGSVGElement } from "react"

  const ReactComponent: FC<SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module "@segment/snippet"
