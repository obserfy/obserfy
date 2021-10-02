import { useRouter } from "next/router"
import { FC } from "react"
import useGetChildren from "../hooks/api/useGetChildren"
import { useQueryString } from "../hooks/useQueryString"
import ChildInfo from "./ChildInfo/ChildInfo"
import Header from "./header"
import Navbar from "./Navbar/Navbar"

const Layout: FC = ({ children }) => {
  useGetChildren()
  const childId = useQueryString("childId")
  const router = useRouter()

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
        <ChildInfo childId={childId} />
      </div>
      <Navbar childId={childId} />
      <main>{children}</main>
    </div>
  )
}

export default Layout
