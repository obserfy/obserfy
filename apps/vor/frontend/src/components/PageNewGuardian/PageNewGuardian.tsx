import React, { FC, useState } from "react"
import Select from "../Select/Select"
import { GuardianRelationship } from "../../api/students/usePostNewStudent"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import Button from "../Button/Button"
import { navigate } from "../Link/Link"
import { EDIT_GUARDIANS_URL } from "../../routes"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { Box } from "../Box/Box"
import { usePostNewGuardian } from "../../api/guardians/usePostNewGuardian"
import BackNavigation from "../BackNavigation/BackNavigation"
import { Typography } from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"

interface Props {
  id: string
}
export const PageNewGuardian: FC<Props> = ({ id }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [relationship, setRelationship] = useState(GuardianRelationship.Other)

  const student = useGetStudent(id)
  const [mutate, { status }] = usePostNewGuardian(id)

  return (
    <Box mx="auto" maxWidth="maxWidth.sm">
      <BackNavigation to={EDIT_GUARDIANS_URL(id)} text="Edit Guardians" />
      <Typography.H5 mx={3} mt={3} color="textDisabled">
        {student.data?.name}
      </Typography.H5>
      <Typography.H5 mx={3} mb={3}>
        New Guardian
      </Typography.H5>
      <Box p={3}>
        <Input
          value={name}
          mb={2}
          label="Guardian Name"
          width="100%"
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          label="Relationship"
          mb={2}
          onChange={(e) => setRelationship(parseInt(e.target.value, 10))}
          value={relationship}
        >
          <option value={GuardianRelationship.Other}>Other</option>
          <option value={GuardianRelationship.Mother}>Mother</option>
          <option value={GuardianRelationship.Father}>Father</option>
        </Select>
        <Input
          type="email"
          value={email}
          mb={2}
          label="Email"
          width="100%"
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="phone"
          value={phone}
          mb={3}
          label="Phone"
          width="100%"
          onChange={(event) => setPhone(event.target.value)}
        />
        <TextArea
          mb={3}
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button
          width="100%"
          disabled={name === ""}
          onClick={async () => {
            const result = await mutate({
              email,
              name,
              phone,
              note,
              relationship,
              studentId: id,
            })
            if (result?.status === 201) {
              await navigate(EDIT_GUARDIANS_URL(id))
            }
          }}
        >
          {status === "loading" && <LoadingIndicator color="onPrimary" />}
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default PageNewGuardian
