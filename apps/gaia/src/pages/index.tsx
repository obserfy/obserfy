import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { findOneOfRelatedStudent } from "$lib/db"

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

const EmptyComponent = () => null
export default EmptyComponent
