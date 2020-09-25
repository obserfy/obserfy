/** @jsx jsx */
import { FC } from "react"
import { Box, Button, Flex, jsx } from "theme-ui"
import { nanoid } from "nanoid"
import { useImmer } from "use-immer"
import { i18nMark } from "@lingui/core"
import { Trans } from "@lingui/macro"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL } from "../../routes"
import Typography from "../Typography/Typography"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { usePostUserInvite } from "../../api/usePostUserInvite"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { useGetSchool } from "../../api/schools/useGetSchool"

export const PageInviteUser: FC = () => {
  const schoolDetail = useGetSchool()
  const [emails, setEmails] = useImmer([{ id: nanoid(), email: "" }])
  const [mutate, { status }] = usePostUserInvite()

  const removeItem = (id: string): void => {
    setEmails((draft) =>
      draft.filter((email) => {
        return email.id !== id
      })
    )
  }
  const editItem = (id: string, email: string): void => {
    const index = emails.findIndex((el) => el.id === id)
    if (email) {
      setEmails((draft) => {
        draft[index].email = email
      })
    }
  }
  const sendInvitation = async (): Promise<void> => {
    const result = await mutate({ email: emails.map((el) => el.email) })
    if (result.ok) {
      setEmails(() => [{ id: nanoid(), email: "" }])
    }
  }
  function shareLink(): void {
    if (window.navigator?.share) {
      window.navigator?.share({
        title: `Join ${schoolDetail.data?.name} in Obserfy`,
        text: "Check out obserfy. Manage your student data.",
        url: schoolDetail.data?.inviteLink,
      })
    }
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation to={SETTINGS_URL} text={i18nMark("Settings")} />
      <Typography.H6 m={3} mb={4} sx={{ lineHeight: 1 }}>
        <Trans>Invite using emails</Trans>
      </Typography.H6>
      {emails?.map(({ id, email }) => (
        <EmailInput
          key={id}
          editItem={editItem}
          removeFromEmailList={removeItem}
          email={email}
          id={id}
        />
      ))}
      <Box mx={3}>
        <Button
          mb={3}
          variant="outline"
          sx={{ width: "100%" }}
          color="onBackground"
          onClick={() =>
            setEmails((draft) => {
              draft.push({ id: nanoid(), email: "" })
            })
          }
        >
          <Icon as={PlusIcon} mr={2} fill="textPrimary" />
          <Trans>Add more email</Trans>
        </Button>
        <Button sx={{ width: "100%" }} onClick={sendInvitation}>
          <Trans>Send invites</Trans>
        </Button>
      </Box>
      {status === "success" && (
        <Typography.Body
          m={3}
          sx={{
            textAlign: "center",
            color: "primary",
            fontWeight: "bold",
          }}
        >
          <Trans>Emails sent!</Trans>
        </Typography.Body>
      )}
      <Typography.Body my={3} sx={{ textAlign: "center" }}>
        <Trans>Or</Trans>
      </Typography.Body>
      <Box
        m={3}
        p={3}
        sx={{
          backgroundColor: "surface",
          borderRadius: "default",
          alignItems: "center",
          borderStyle: "solid",
          borderColor: "border",
          borderWidth: 1,
        }}
      >
        <Typography.Body color="textMediumEmphasis" fontSize={1}>
          <Trans>Invite using link</Trans>
        </Typography.Body>
        <Typography.Body mb={3}>
          Share this link to your co-workers. Once they register using it,
          they&apos;ll have access to {schoolDetail.data?.name}.
        </Typography.Body>
        {schoolDetail.status === "loading" &&
          !schoolDetail.data?.inviteLink && (
            <LoadingPlaceholder sx={{ width: "100%", height: 60 }} />
          )}
        <Typography.Body sx={{ width: "100%" }} onClick={shareLink}>
          {schoolDetail.data?.inviteLink}
        </Typography.Body>
      </Box>
    </Box>
  )
}

const EmailInput: FC<{
  id: string
  email?: string
  editItem: Function
  removeFromEmailList: Function
}> = ({ id, editItem, removeFromEmailList }) => {
  return (
    <Flex px={3} mb={2}>
      <Button variant="outline" onClick={() => removeFromEmailList(id)}>
        <Icon as={CloseIcon} fill="danger" />
      </Button>
      <Input
        sx={{ width: "100%" }}
        name="email"
        ml={2}
        placeholder="Email address"
        onChange={(e) => editItem(id, e.target.value)}
      />
    </Flex>
  )
}

export default PageInviteUser
