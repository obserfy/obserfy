/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC } from "react"
import Header from "./Header"
import "./global.css"
import TopDecoration from "../images/top-bg.svg"
import Footer from "./Footer"

const Layout: FC = ({ children }) => {
  return (
    <div className="bg-no-repeat min-h-screen">
      <img
        alt="decoration"
        src={TopDecoration}
        className="absolute top-0 left-0 right-0 -z-50 w-screen"
      />
      <Header />

      <div className="max-w-7xl mx-auto relative pb-16">
        <main>{children}</main>
      </div>

      <Footer />
    </div>
  )
}

export default Layout
