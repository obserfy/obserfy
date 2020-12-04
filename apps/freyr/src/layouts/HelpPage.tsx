import React, { FC } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Header from "../components/Header"

const HelpPage: FC = ({ children }) => {
  const menu = useStaticQuery<GatsbyTypes.HelpCenterMenuQuery>(graphql`
    query HelpCenterMenu {
      allMdx {
        edges {
          node {
            frontmatter {
              title
            }
            headings {
              value
            }
          }
        }
      }
    }
  `)
  return (
    <div className="max-w-7xl mx-auto relative">
      <Header />
      <div className="flex">
        <div>
          {menu.allMdx.edges.map(data => {
            return <div>{data.node.frontmatter?.title}</div>
          })}
        </div>
        <main className="prose px-5">{children}</main>
      </div>
    </div>
  )
}

export default HelpPage
