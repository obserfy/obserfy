import { t } from "@lingui/macro"
import { FC, useState } from "react"
import { Box } from "theme-ui"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"

interface NewGuardian {
  name: string
  email: string
  phone: string
  note: string
  address: string
}
export interface NewGuardianFormProps {
  newGuardian: NewGuardian
  onChange: (guardian: NewGuardian) => void
}
const NewGuardianForm: FC<NewGuardianFormProps> = ({
  newGuardian,
  onChange,
}) => {
  const { name, note, email, phone, address } = newGuardian

  const handleChange = (newData: Partial<NewGuardian>) => {
    onChange({
      ...newGuardian,
      ...newData,
    })
  }

  return (
    <Box p={3}>
      <Input
        value={name}
        mb={2}
        label={t`Guardian Name`}
        sx={{ width: "100%" }}
        onChange={(e) => handleChange({ name: e.target.value })}
      />
      <Input
        type="email"
        value={email}
        mb={2}
        label={t`Email`}
        sx={{ width: "100%" }}
        onChange={(e) => handleChange({ email: e.target.value })}
      />
      <Input
        type="phone"
        value={phone}
        mb={3}
        label={t`Phone`}
        sx={{ width: "100%" }}
        onChange={(e) => handleChange({ phone: e.target.value })}
      />
      <Input
        value={address}
        mb={3}
        label={t`Address`}
        sx={{ width: "100%" }}
        onChange={(e) => handleChange({ address: e.target.value })}
      />
      <TextArea
        mb={3}
        label={t`Note`}
        value={note}
        onChange={(e) => handleChange({ note: e.target.value })}
      />
    </Box>
  )
}

export const useNewGuardianFormState = () =>
  useState({
    email: "",
    name: "",
    phone: "",
    note: "",
    address: "",
  })

export default NewGuardianForm
