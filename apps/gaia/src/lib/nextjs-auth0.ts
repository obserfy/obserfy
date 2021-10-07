/** Functions to help with handling @auth0/nextjs-auth0 */
import { withPageAuthRequired as withPageAuthRequiredOriginal } from "@auth0/nextjs-auth0"
import { Claims } from "@auth0/nextjs-auth0/src/session/index"
import { GetServerSideProps } from "next"

interface Options<P> {
  getServerSideProps: GetServerSideProps<P>
  returnTo?: string
}

/** fix withPageAuthRequired type inference */
export function withPageAuthRequired<P>(opts: Options<P>) {
  return withPageAuthRequiredOriginal(opts) as GetServerSideProps<
    { user?: Claims | null } & P
  >
}
