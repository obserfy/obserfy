/** @jsx jsx */
import { FC, useState } from "react"
import { Box, Card, Flex, Button, jsx } from "theme-ui"
import { nanoid } from "nanoid"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL } from "../../routes"
import Typography from "../Typography/Typography"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { usePostUserInvite } from "../../api/usePostUserInvite"

export const PageInviteUser: FC = () => {
  const [emailList, setEmailList] = useState<{ id: string; email: string }[]>(
    []
  )
  const [mutate] = usePostUserInvite()
  const removeItem = (id: string): void => {
    const index = emailList.findIndex((el) => el.id === id)
    const list = [...emailList]
    list.splice(index, 1)
    setEmailList(list)
  }
  const editItem = (id: string, email: string): void => {
    const index = emailList.findIndex((el) => el.id === id)
    if (email) {
      const temp = { ...emailList[index] }
      temp.email = email
      const list = [...emailList]
      list[index].email = email
      setEmailList([...list])
    }
  }
  const sendInvitation = async (): Promise<void> => {
    const result = await mutate({ email: emailList.map((el) => el.email) })
    if (result.ok) {
      setEmailList([])
    }
  }
  return (
    <Box
      sx={{
        flexDirection: "column",
        maxWidth: "maxWidth.md",
      }}
      mx="auto"
    >
      <BackNavigation to={SETTINGS_URL} text="Settings" />
      <Typography.H5 m={3} sx={{ lineHeight: 1 }}>
        Invite User
      </Typography.H5>
      {emailList?.map(({ id, email }) => (
        <StudentCard
          key={id}
          editItem={editItem}
          removeFromEmailList={removeItem}
          email={email}
          id={id}
        />
      ))}
      <PlaceholderCard addToEmailList={setEmailList} emailList={emailList} />
      <Flex mx={[0, 3]}>
        <Button sx={{ width: "100%" }} onClick={sendInvitation}>
          Send Invitation
        </Button>
      </Flex>
    </Box>
  )
}

const StudentCard: FC<{
  id: string
  email?: string
  editItem: Function
  removeFromEmailList: Function
}> = ({ id, editItem, removeFromEmailList }) => {
  return (
    <Card
      p={3}
      mx={[0, 3]}
      mb={[0, 2]}
      sx={{
        backgroundColor: ["background", "surface"],
        borderRadius: [0, "default"],
        boxShadow: ["none", "low"],
        display: "flex",
        alignItems: "center",
      }}
    >
      <Button variant="outline" sx={{ height: "100%" }}>
        <Icon as={CloseIcon} m={0} onClick={() => removeFromEmailList(id)} />
      </Button>
      <Input
        sx={{ width: "100%" }}
        name="name"
        ml={3}
        placeholder="Email address"
        onChange={(e) => editItem(id, e.target.value)}
      />
    </Card>
  )
}
const PlaceholderCard: FC<{
  addToEmailList: Function
  emailList: Array<{ email: string }>
}> = ({ addToEmailList, emailList }) => {
  return (
    <Card
      p={3}
      mx={[0, 3]}
      mb={[0, 2]}
      sx={{
        backgroundColor: ["background", "surface"],
        borderRadius: [0, "default"],
        boxShadow: ["none", "low"],
        display: "flex",
        alignItems: "center",
      }}
    >
      <Button variant="outline" sx={{ height: "100%" }}>
        <Icon
          as={PlusIcon}
          m={0}
          onClick={() =>
            addToEmailList([...emailList, { id: nanoid(), email: "" }])
          }
        />
      </Button>
      <Flex sx={{ flexDirection: "column", alignItems: "start" }}>
        <Typography.Body ml={3} sx={{ lineHeight: 1.6 }}>
          Add More Email
        </Typography.Body>
      </Flex>
    </Card>
  )
}
export default PageInviteUser
