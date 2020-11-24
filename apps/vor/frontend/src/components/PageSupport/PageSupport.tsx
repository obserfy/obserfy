/** @jsx jsx */
import { FC, useEffect } from "react"
import { jsx, Box, Card, Flex, Button } from "theme-ui"
import { Trans } from "@lingui/macro"
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
  }, [status, data])
  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <Typography.H6 mx={3} mt={4} mb={2}>
        <Trans>Help and Feedbacks</Trans>
      </Typography.H6>
      <Card sx={{ borderRadius: [0, "default"] }}>
        <a href="https://feedback.obserfy.com">
          <Flex p={3} sx={{ alignItems: "center" }}>
            <Box mr={3}>
              <Typography.Body>
                <Trans>Go to Canny</Trans>
              </Typography.Body>
              <Typography.Body color="textMediumEmphasis">
                <Trans>Post and upvote suggestions, ideas, and issues.</Trans>
              </Typography.Body>
            </Box>
            <Icon as={NextIcon} ml="auto" />
          </Flex>
        </a>

        <Flex m={3} sx={{ alignItems: "flex-start" }}>
          <Box mr={3}>
            <Typography.Body>
              <Trans>Shoot us an e-mail</Trans>
            </Typography.Body>
            <Typography.Body color="textMediumEmphasis">
              <Trans>
                Have a question? Shoot us an email at support@obserfy.com
              </Trans>
            </Typography.Body>
          </Box>
          <a
            href="mailto:support@obserfy.com"
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
