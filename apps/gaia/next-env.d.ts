/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="optimized-images-loader" />
//
// declare module "*.svg" {
//   import { ImgSrc } from "react-optimized-image"
//
//   const content: ImgSrc
//   export default content
// }
//
// declare module "*.png" {
//   import { ImgSrc } from "react-optimized-image"
//
//   const content: ImgSrc
//   export default content
// }
//
// declare module "*.jpg" {
//   import { ImgSrc } from "react-optimized-image"
//
//   const content: ImgSrc
//   export default content
// }
//
// declare module "*.ico" {
//   import { ImgSrc } from "react-optimized-image"
//
//   const content: ImgSrc
//   export default content
// }

// eslint-disable-next-line import/no-unresolved

declare const Canny: (method: string, data: any) => void

declare const mixpanel: any

declare module "formidable-serverless" {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  export * from "formidable"
}

declare module "@segment/snippet"
