import Header from "$components/Header"
import Navbar from "$components/Navbar"
import StudentInfo from "$components/StudentInfo"
import { useQueryString } from "$hooks/useQueryString"
import { useRouter } from "next/router"
import { FC } from "react"
import useGetChildren from "../hooks/api/useGetChildren"

const BaseLayout: FC = ({ children }) => {
  useGetChildren()
  const router = useRouter()
  const studentId = useQueryString("studentId")

  if (router.pathname === "/no-data") {
    return (
      <div className="bg-background">
        <div className="min-h-screen bg-surface">
          <Header />
          <main>{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="pb-3 bg-surface">
        <Header />
        <StudentInfo studentId={studentId} />
      </div>
      <Navbar studentId={studentId} />
      <main>{children}</main>
    </div>
  )
}

export default BaseLayout
