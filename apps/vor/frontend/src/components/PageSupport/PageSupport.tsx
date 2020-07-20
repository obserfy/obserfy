/** @jsx jsx */
import { FC, useEffect } from "react"
import { jsx, Box, Card, Flex, Button } from "theme-ui"
import { useGetUserProfile } from "../../api/useGetUserProfile"
import { loadCanny } from "../../canny"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as MailIcon } from "../../icons/mail.svg"

export const PageSupport: FC = () => {
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
  }, [status])
  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <Typography.H6 mx={3} mt={4} mb={2}>
        Give feedbacks
      </Typography.H6>
      <Card sx={{ borderRadius: [0, "default"] }}>
        <a href="https://feedback.obserfy.com/feature-requests">
          <Flex p={3} sx={{ alignItems: "center" }}>
            <Typography.Body>Feature Requests</Typography.Body>
            <Icon as={NextIcon} m={0} ml="auto" />
          </Flex>
        </a>
        <a href="https://feedback.obserfy.com/bug-reports">
          <Flex p={3} sx={{ alignItems: "center" }}>
            <Typography.Body>Bug Report</Typography.Body>
            <Icon as={NextIcon} m={0} ml="auto" />
          </Flex>
        </a>
        <a href="https://feedback.obserfy.com">
          <Flex p={3} sx={{ alignItems: "center" }}>
            <Typography.Body>Roadmap</Typography.Body>
            <Icon as={NextIcon} m={0} ml="auto" />
          </Flex>
        </a>
      </Card>

      <Typography.H6 m={3} mt={4} mb={2}>
        We are here to help
      </Typography.H6>
      <Card sx={{ borderRadius: [0, "default"] }}>
        <Flex m={3} sx={{ alignItems: "flex-start" }}>
          <Box mr={3}>
            <Typography.Body>Shoot us an Email</Typography.Body>
            <Typography.Body color="textMediumEmphasis">
              Have a question? Shoot us an email at chrsep@protonmail.com
            </Typography.Body>
          </Box>
          <a
            href="mailto:chrsep@protonmail.com"
            sx={{ ml: "auto", flexShrink: 0 }}
          >
            <Button variant="outline" px={2} py={1}>
              <Icon as={MailIcon} my={1} mx={0} ml="auto" />
            </Button>
          </a>
        </Flex>
      </Card>
    </Box>
  )
}

export default PageSupport
