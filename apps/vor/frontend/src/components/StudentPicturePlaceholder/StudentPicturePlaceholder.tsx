/** @jsx jsx */
import { jsx } from "theme-ui"
import { FC } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage from "gatsby-image"

export const StudentPicturePlaceholder: FC = () => {
  const image = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "gradients/1.jpg" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fixed(width: 32, height: 32) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <GatsbyImage
      fixed={image.file.childImageSharp?.fixed}
      sx={{ borderRadius: "circle" }}
    />
  )
}

export default StudentPicturePlaceholder
