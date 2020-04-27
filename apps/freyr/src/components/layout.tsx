/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC } from "react"

import Header from "./header"
import "./global.css"

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <div className="px-3 max-w-6xl mx-auto">
        <main>{children}</main>
        <footer className="text-center m-3">
          © {new Date().getFullYear()}, Obserfy
        </footer>
      </div>
    </>
  )
}

export default Layout
