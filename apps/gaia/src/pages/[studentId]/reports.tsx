import { findStudentProgressReports } from "$lib/db"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { FC } from "react"

type Props = InferGetServerSidePropsType<typeof getServerSideProps>
type Context = GetServerSidePropsContext<{ studentId: string }>

const Reports: FC<Props> = () => {
  return <div>reports</div>
}

export const getServerSideProps = async ({ query }: Context) => {
  const reports = await findStudentProgressReports(query.studentId as string)

  return {
    props: { reports },
  }
}

export default Reports
