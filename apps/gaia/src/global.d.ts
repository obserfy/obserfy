declare const mixpanel: any

declare module "formidable-serverless" {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  import formidable from "formidable"

  export default formidable
}

declare module NodeJS {
  interface Global {
    prisma: any
  }
}
