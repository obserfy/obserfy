declare const mixpanel: any

declare module "formidable-serverless" {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  import formidable from "formidable"

  export default formidable
}

// Dev-only PrismaClient cache, see src/lib/prisma.ts. @types/node 16+ types
// `global` as `typeof globalThis`, so it is declared as a global var.
declare var prisma: any

declare module "mux-embed" {
  const monitor: any
}

// Global stylesheets are imported for their side effects only.
declare module "*.css" {}
