import { graphql, Link, useStaticQuery } from "gatsby"
import React, { FC } from "react"
import GatsbyImage from "gatsby-image"

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
        <a href="https://app.obserfy.com/login">
          <h2 className="mr-3 font-body font-bold">Login</h2>
        </a>
      </div>
    </header>
  )
}

export default Header
