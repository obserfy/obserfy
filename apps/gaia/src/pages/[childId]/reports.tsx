import { InferGetServerSidePropsType } from "next"
import { FC } from "react"

type ReportsProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Reports: FC<ReportsProps> = ({ reports }) => {
  return <div>reports</div>
}

export const getServerSideProps = async () => {
  return {
    props: {
      reports: [],
    },
  }
}

export default Reports
