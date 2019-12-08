import React, { FC } from "react"
import Box from "../Box/Box"
import Input from "../Input/Input"
import Card from "../Card/Card"
import Typography from "../Typography/Typography"
import Flex from "../Flex/Flex"
import Icon from "../Icon/Icon"
import Spacer from "../Spacer/Spacer"
import { ReactComponent as ShareIcon } from "../../icons/share.svg"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import Button from "../Button/Button"

export const PageSettings: FC = () => {
  function shareLink(): void {
    if (navigator.share) {
      navigator.share({
        title: "Vor Invitation",
        text: "Check out vor. Manage your student data.",
        url: "https://vor.chrsep.dev/",
      })
    }
  }

  return (
    <Box maxWidth="maxWidth.sm" margin="auto" p={3}>
      <Card p={3} mb={3}>
        <Typography.H5 mb={3}>Invite your co-workers</Typography.H5>
        <Typography.Body
          fontSize={1}
          mb={3}
          color="textMediumEmphasis"
          lineHeight="2em"
        >
          Use this link to invite other school members, such as teachers. Using
          this link would give them access to this school.
        </Typography.Body>
        <Box
          p={3}
          backgroundColor="tintYellow"
          sx={{ borderRadius: "default" }}
          onClick={shareLink}
        >
          <Flex alignItems="center">
            <Box>
              <Typography.Body
                fontSize={0}
                lineHeight={1}
                mb={2}
                sx={{ userSelect: "none" }}
              >
                Invitation Link
              </Typography.Body>
              <Typography.Body
                id="shareLink"
                fontSize={1}
                lineHeight="1.5em"
                sx={{ wordWrap: "break-word", textDecoration: "underline" }}
              >
                https://localhost:8001/settingshttps://localhost:8001/settings
              </Typography.Body>
            </Box>
            <Spacer />
            <Icon minWidth={24} size={24} as={ShareIcon} m={0} mr={2} />
          </Flex>
        </Box>
      </Card>
      <Box pt={3}>
        <Typography.H5 mb={3}>Accounts Connected</Typography.H5>
        <Card p={3} mt={2}>
          <Flex alignItems="center">
            <Box>
              <Typography.H6>Alyssa Caughn</Typography.H6>
              <Typography.Body fontSize={1} color="textMediumEmphasis">
                alyssa@gmail.com
              </Typography.Body>
            </Box>
            <Spacer />
            <Icon as={TrashIcon} m={0} mr={2} fill="danger" />
          </Flex>
        </Card>
        <Card p={3} mt={2}>
          <Flex alignItems="center">
            <Box>
              <Typography.H6>Alyssa Caughn</Typography.H6>
              <Typography.Body fontSize={1} color="textMediumEmphasis">
                alyssa@gmail.com
              </Typography.Body>
            </Box>
            <Spacer />
            <Icon as={TrashIcon} m={0} mr={2} fill="danger" />
          </Flex>
        </Card>
      </Box>
      <Box pt={4}>
        <Typography.H5 mb={3}>School Info</Typography.H5>
        <Input width="100%" label="School Name" mb={3} />
        <Flex>
          <Spacer />
          <Button variant="outline" mr={2}>
            Reset
          </Button>
          <Button>Save</Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default PageSettings
