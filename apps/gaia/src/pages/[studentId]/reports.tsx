import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { FC } from "react"
import BaseLayout from "$layouts/BaseLayout"
import { findStudentProgressReports } from "$lib/db"

type Props = InferGetServerSidePropsType<typeof getServerSideProps>
type Context = GetServerSidePropsContext<{ studentId: string }>

const Reports: FC<Props> = () => {
  return <BaseLayout title="Progress Reports">reports</BaseLayout>
}

export const getServerSideProps = async ({ query }: Context) => {
  const reports = await findStudentProgressReports(query.studentId as string)

  return {
    props: { reports },
  }
}

export default Reports
