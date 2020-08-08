import { graphql, useStaticQuery } from "gatsby"
import { LocalizedLink as Link } from "gatsby-theme-i18n"
import React, { FC } from "react"
import GatsbyImage from "gatsby-image"
import { Trans } from "@lingui/macro"
import Button from "./button"

const Header: FC = () => {
  const query = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "logo-transparent.png" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fixed(width: 40, height: 40) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <header
      style={{ marginBottom: `1.45rem` }}
      className="max-w-lg p-3 flex flex-row items-center max-w-6xl mx-auto"
    >
      <div className="flex items-center mr-auto">
        <GatsbyImage fixed={query.file.childImageSharp.fixed} />
        <h1 className="text-xl ml-3 font-bold font-body">
          <Link to="/">Obserfy</Link>
        </h1>
      </div>
      <div className="flex items-center">
        <a href="https://app.obserfy.com/" className="">
          <Button className="px-3 py-2 mr-3 border bg-transparent text-gray-700 text-sm">
            <Trans>Teachers</Trans>
          </Button>
        </a>

        <a href="https://parent.obserfy.com/api/login">
          <Button className="px-3 py-2 border bg-transparent text-gray-700 text-sm">
            <Trans>Parents</Trans>
          </Button>
        </a>
      </div>
    </header>
  )
}

export default Header
