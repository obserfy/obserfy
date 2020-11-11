import React, { FC } from "react"
import { useRouter } from "next/router"
import Header from "./header"
import useGetChildren from "../hooks/api/useGetChildren"
import ChildInfo from "./ChildInfo/ChildInfo"
import { useQueryString } from "../hooks/useQueryString"
import Navbar from "./Navbar/Navbar"

const Layout: FC = ({ children }) => {
  useGetChildren()
  const childId = useQueryString("childId")
  const router = useRouter()

  if (
    router.pathname === "/session-expired" ||
    router.pathname === "/no-data"
  ) {
    return (
      <div className="bg-background">
        <div className="bg-surface min-h-screen">
          <Header />
          <main>{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="bg-surface pb-3">
        <Header />
        <ChildInfo childId={childId} />
      </div>
      <Navbar childId={childId} />
      <main>{children}</main>
    </div>
  )
}

export default Layout
