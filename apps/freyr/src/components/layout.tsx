/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC } from "react"

import Header from "./header"
import "./global.css"
import { Link } from "gatsby"

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <div className="px-3 max-w-6xl mx-auto">
        <main>{children}</main>
        <footer className="text-center m-3 md:mx-0 flex items-center pt-8 text-gray-700">
          <div>© {new Date().getFullYear()} Obserfy</div>
          <Link to="/privacy-policy" className="ml-3 underline">
            Privacy Policy
          </Link>
        </footer>
      </div>
    </>
  )
}

export default Layout
