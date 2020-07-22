/** @jsx jsx */
import { FC, useEffect } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage, { FixedObject } from "gatsby-image"
import { Button, Flex, jsx } from "theme-ui"
import Typography from "../Typography/Typography"
import { useGetUserProfile } from "../../api/useGetUserProfile"
import { loadCanny } from "../../canny"

export const PageError: FC = () => {
  const astronaut = useStaticQuery(graphql`
    query AstronautImage {
      file: file(relativePath: { eq: "astronaut.png" }) {
        childImageSharp {
          fixed(width: 180, height: 180) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)

  const { data, status } = useGetUserProfile()

  useEffect(() => {
    if (status === "success") {
      loadCanny()
      Canny("identify", {
        appID: "5f0d32f03899af5d46779764",
        user: {
          // Replace these values with the current user's data
          email: data?.email,
          name: data?.name,
          id: data?.id,
          companies: [
            {
              name: data?.school.name,
              id: data?.school.id,
            },
          ],
        },
      })
    }
  }, [status, data])

  return (
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <GatsbyImage
          fixed={astronaut?.file?.childImageSharp?.fixed as FixedObject}
        />
        <Typography.H3
          pt={3}
          sx={{ textAlign: "center", lineHeight: 1.2 }}
          m={3}
          mb={3}
        >
          Oops, Something went wrong
        </Typography.H3>
        <Typography.Body mb={4} mx={3} sx={{ textAlign: "center" }}>
          Sorry, please try reloading the page.
        </Typography.Body>
        <Flex>
          <a href="https://feedback.obserfy.com/bug-reports/create">
            <Button variant="outline">Report</Button>
          </a>
          <a href="/">
            <Button ml={2}>Reload</Button>
          </a>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PageError
