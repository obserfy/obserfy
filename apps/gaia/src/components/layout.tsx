import React, { FC } from "react"
import Header from "./header"
import useGetChildren from "../hooks/api/useGetChildren"
import ChildInfo from "./ChildInfo/ChildInfo"
import { useQueryString } from "../hooks/useQueryString"
import Navbar from "./Navbar/Navbar"

const Layout: FC = ({ children }) => {
  useGetChildren()
  const childId = useQueryString("childId")

  return (
    <div className="bg-background">
      <div className="bg-surface">
        <Header />
        <ChildInfo childId={childId} />
      </div>
      <Navbar childId={childId} />
      <main>{children}</main>
    </div>
  )
}

export default Layout
