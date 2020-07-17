/** @jsx jsx */
import { FC } from "react"
import { Box, Button, Flex, jsx } from "theme-ui"
import { nanoid } from "nanoid"
import { useImmer } from "use-immer"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL } from "../../routes"
import Typography from "../Typography/Typography"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { usePostUserInvite } from "../../api/usePostUserInvite"

export const PageInviteUser: FC = () => {
  const [emails, setEmails] = useImmer([{ id: nanoid(), email: "" }])
  const [mutate] = usePostUserInvite()

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
      setEmails(() => [])
    }
  }
  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation to={SETTINGS_URL} text="Settings" />
      <Typography.H5 m={3} mb={4} sx={{ lineHeight: 1 }}>
        Invite Users
      </Typography.H5>
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
          p={0}
          mb={3}
          variant="outline"
          sx={{ width: "100%" }}
          onClick={() =>
            setEmails((draft) => {
              draft.push({ id: nanoid(), email: "" })
            })
          }
        >
          <Icon as={PlusIcon} m={0} />
          <Typography.Body py={2} ml={2} sx={{ lineHeight: 1.6 }}>
            Add More Email
          </Typography.Body>
        </Button>
        <Button sx={{ width: "100%" }} onClick={sendInvitation}>
          Send Invitation
        </Button>
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
        <Icon as={CloseIcon} m={0} />
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
