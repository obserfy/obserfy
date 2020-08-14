import React, { FC } from "react"
import { Router } from "next/router"
import Header from "./header"
import useGetChildren from "../hooks/api/useGetChildren"
import ChildInfo from "./ChildInfo/ChildInfo"
import { useQueryString } from "../hooks/useQueryString"
import Navbar from "./Navbar/Navbar"

// Track client-side page views with Segment
Router.events.on("routeChangeComplete", (url) => {
  window.analytics.page(url)
})

const Layout: FC = ({ children }) => {
  useGetChildren()
  const childId = useQueryString("childId")

  return (
    <div className="bg-background">
      <div className="bg-surface">
        <Header />
        <ChildInfo childId={childId} />
      </div>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default Layout
