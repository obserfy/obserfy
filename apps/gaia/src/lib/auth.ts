import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { findStudentAndGuardianById } from "$lib/db"

// Same shape as Next's GetServerSideProps<P>, minus its
// `P extends { [key: string]: any }` constraint: TypeScript 4.8+ rejects our
// unconstrained P there, and constraining P instead stops props inference.
export const withAuthorization = <P>(
  getServerSideProps: (
    ctx: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>,
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
