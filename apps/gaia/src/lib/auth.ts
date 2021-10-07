import { getSession } from "@auth0/nextjs-auth0"
import { withPageAuthRequired } from "$lib/nextjs-auth0"
import { findStudentByStudentIdAndUserEmail } from "$lib/db"

export const withStudentAuthorizationCheck = () => {
  return withPageAuthRequired({
    async getServerSideProps({ req, res, query }) {
      const { studentId } = query
      if (typeof studentId !== "string") {
        return {
          redirect: {
            destination: `/`,
            statusCode: 307,
          },
        }
      }

      const session = await getSession(req, res)
      const students = await findStudentByStudentIdAndUserEmail(
        studentId,
        session?.user.email
      )

      if (students) {
        return {
          redirect: {
            destination: `/${students.id}/`,
            statusCode: 307,
          },
        }
      }

      return {
        redirect: {
          destination: `/no-data`,
          statusCode: 307,
        },
      }
    },
  })
}
