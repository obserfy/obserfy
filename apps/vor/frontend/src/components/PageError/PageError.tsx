import { StaticImage } from "gatsby-plugin-image"
import { FC, useEffect } from "react"
import { Button, Flex } from "theme-ui"
import Typography from "../Typography/Typography"
import { useGetUserProfile } from "../../hooks/api/useGetUserProfile"
import { loadCanny } from "../../canny"

export const PageError: FC = () => {
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
      }}
    >
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StaticImage
          width={180}
          height={180}
          src="../../images/astronaut.png"
          alt="Illustration of something that went wrong"
          placeholder="blurred"
        />
        <Typography.H5
          pt={3}
          sx={{ textAlign: "center", lineHeight: 1.2 }}
          m={3}
          mb={3}
        >
          Oops, Something went wrong
        </Typography.H5>
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
