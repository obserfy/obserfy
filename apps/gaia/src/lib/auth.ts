import {
  getSession,
  withPageAuthRequired as withPageAuthRequiredOriginal,
} from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"
import { findStudentAndGuardianById } from "$lib/db"

export interface Claims {
  [key: string]: any
}

interface Options<P> {
  getServerSideProps: GetServerSideProps<P>
  returnTo?: string
}

/** fix withPageAuthRequired type inference */
function withPageAuthRequired<P>(opts: Options<P>) {
  return withPageAuthRequiredOriginal(opts) as GetServerSideProps<
    { user?: Claims | null } & P
  >
}

export const withAuthorization = <P>(
  getServerSideProps: GetServerSideProps<P>,
  opts?: { returnTo?: string }
) => {
  return withPageAuthRequired<P>({
    returnTo: opts?.returnTo,
    async getServerSideProps(ctx) {
      const { studentId } = ctx.query
      if (typeof studentId !== "string") {
        return {
          redirect: {
            destination: `/`,
            statusCode: 307,
          },
        }
      }

      const session = await getSession(ctx.req, ctx.res)
      const student = await findStudentAndGuardianById(
        studentId,
        session?.user.email
      )

      if (!student) {
        return {
          redirect: {
            destination: `/no-data`,
            statusCode: 307,
          },
        }
      }

      if (student.guardian_to_students.length === 0) {
        return {
          redirect: {
            destination: `/404`,
            statusCode: 307,
          },
        }
      }

      return getServerSideProps(ctx)
    },
  })
}
