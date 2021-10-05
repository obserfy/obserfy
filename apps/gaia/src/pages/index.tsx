import { findOneOfRelatedStudent } from "$lib/db"
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const session = await getSession(req, res)
    const students = await findOneOfRelatedStudent(session?.user.email)

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

export default () => <></>
