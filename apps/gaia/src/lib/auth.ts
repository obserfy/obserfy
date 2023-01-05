import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"
import { findStudentAndGuardianById } from "$lib/db"

export const withAuthorization = <P>(
  // @ts-ignore P conflicts with new GetServerSideProps<P>, but if we fixed it by extending P, we lose the type
  //  inference.
  //  Ignoring this error now doesn't break inference or anything else.
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
