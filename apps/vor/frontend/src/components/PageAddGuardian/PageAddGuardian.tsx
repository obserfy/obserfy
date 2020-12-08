import React, { FC, useState } from "react"
import { Box, Button, Flex } from "theme-ui"

import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { Card } from "@theme-ui/components"
import Select from "../Select/Select"
import { GuardianRelationship } from "../../api/students/usePostNewStudent"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import { navigate } from "../Link/Link"
import {
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENT_PROFILE_URL,
  STUDENTS_URL,
} from "../../routes"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

import { usePostNewGuardian } from "../../api/guardians/usePostNewGuardian"
import { Typography } from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import { getFirstName } from "../../domain/person"
import Chip from "../Chip/Chip"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import { borderBottom, borderTop } from "../../border"
import { useGetSchoolGuardians } from "../../api/guardians/useGetSchoolGuardians"
import SearchBar from "../SearchBar/SearchBar"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { usePostGuardianRelation } from "../../api/guardians/usePostGuardianRelation"

interface Props {
  id: string
}
export const PageAddGuardian: FC<Props> = ({ id }) => {
  const { i18n } = useLingui()
  const student = useGetStudent(id)
  const [postNewGuardian, { status }] = usePostNewGuardian(id)
  const [mode, setMode] = useState(0)
  const [relationship, setRelationship] = useState(GuardianRelationship.Mother)
  const [newGuardian, setNewGuardian] = useState({
    email: "",
    name: "",
    phone: "",
    note: "",
    address: "",
  })
  const [selectedGuardian, setSelectedGuardian] = useState("")
  const [postNewGuardianRelation] = usePostGuardianRelation(
    { id: selectedGuardian },
    id
  )

  const handleSubmit = async () => {
    if (mode === 0) {
      const result = await postNewGuardian({
        ...newGuardian,
        studentId: id,
        relationship,
      })
      if (result?.status === 201) await navigate(STUDENT_PROFILE_URL(id))
    } else {
      const result = await postNewGuardianRelation(relationship)
      if (result?.status === 201) await navigate(STUDENT_PROFILE_URL(id))
    }
  }

  const isFormValid = (): boolean => {
    if (mode === 0) {
      return newGuardian.name !== ""
    }
    return selectedGuardian !== ""
  }

  return (
    <>
      <TranslucentBar boxSx={{ position: "sticky", top: 0, ...borderBottom }}>
        <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} mx="auto">
          <TopBar
            breadcrumbs={[
              breadCrumb(t`Students`, STUDENTS_URL),
              breadCrumb(
                getFirstName(student.data),
                STUDENT_OVERVIEW_PAGE_URL(id)
              ),
              breadCrumb(t`Profile`, STUDENT_PROFILE_URL(id)),
              breadCrumb(t`Add Guardian`),
            ]}
          />
          <Button
            ml="auto"
            mr={2}
            px={2}
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            {status === "loading" && <LoadingIndicator color="onPrimary" />}
            <Trans>Add</Trans>
          </Button>
        </Flex>
      </TranslucentBar>

      <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
        <Typography.H5 mx={3} mt={4} mb={2}>
          <Trans>Add Guardian</Trans>
        </Typography.H5>
        <Flex mb={3}>
          <Chip
            text="Create new"
            ml={3}
            isActive={mode === 0}
            onClick={() => setMode(0)}
          />
          <Chip
            text="From existing"
            ml={2}
            isActive={mode === 1}
            onClick={() => setMode(1)}
          />
        </Flex>

        <Box px={3} pt={3}>
          <Select
            label={t`Relationship`}
            value={relationship}
            onChange={(e) => setRelationship(parseInt(e.target.value, 10))}
          >
            <option value={GuardianRelationship.Other}>
              {i18n._(t`Other`)}
            </option>
            <option value={GuardianRelationship.Mother}>
              {i18n._(t`Mother`)}
            </option>
            <option value={GuardianRelationship.Father}>
              {i18n._(t`Father`)}
            </option>
          </Select>
        </Box>

        {mode === 0 && (
          <CreateNewForm newGuardian={newGuardian} onChange={setNewGuardian} />
        )}
        {mode === 1 && (
          <GuardianSelectorForm
            currentGuardianIds={student.data?.guardians.map(
              ({ id: guardianId }) => guardianId
            )}
            onChange={setSelectedGuardian}
            selectedId={selectedGuardian}
          />
        )}
      </Box>
    </>
  )
}

interface NewGuardian {
  name: string
  email: string
  phone: string
  note: string
  address: string
}
const CreateNewForm: FC<{
  newGuardian: NewGuardian
  onChange: (guardian: NewGuardian) => void
}> = ({ newGuardian, onChange }) => {
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

const GuardianSelectorForm: FC<{
  selectedId: string
  onChange: (value: string) => void
  currentGuardianIds?: string[]
}> = ({ selectedId, onChange, currentGuardianIds = [] }) => {
  const { data: guardians, isLoading } = useGetSchoolGuardians()

  const [filter, setFilter] = useState("")

  return (
    <Box pb={4}>
      <Card mt={3} mx={[0, 3]} sx={{ borderRadius: [0, "default"] }}>
        <Box p={3}>
          <SearchBar
            sx={{ backgroundColor: "background" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Box>

        {isLoading && <GuardianListLoadingPlaceholder />}

        {guardians
          ?.filter(
            ({ id, name }) =>
              name.match(new RegExp(filter, "i")) &&
              !currentGuardianIds.includes(id)
          )
          .map(({ id, name, email }) => (
            <Flex
              pl={3}
              pr={2}
              py={2}
              key={id}
              onClick={() => onChange(id)}
              sx={{
                ...borderTop,
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: id === selectedId ? "primaryLight" : undefined,
                "&:hover": {
                  backgroundColor:
                    id === selectedId ? "primaryLight" : "primaryLightest",
                },
                transition: "background-color 150ms ease-in-out",
              }}
            >
              <Typography.Body sx={{ width: "100%" }}>{name}</Typography.Body>
              <Typography.Body
                py={1}
                px={email ? 0 : 2}
                backgroundColor={email ? "transparent" : "tintWarning"}
                color="textMediumEmphasis"
                sx={{
                  width: "100%",
                  borderRadius: "default",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: email ? "normal" : "bold",
                }}
              >
                {email || <Trans>No email set</Trans>}
              </Typography.Body>
            </Flex>
          ))}
      </Card>
    </Box>
  )
}

const GuardianListLoadingPlaceholder = () => {
  return (
    <Box>
      <LoadingPlaceholder sx={{ height: 34 }} m={3} mt={0} />
      <LoadingPlaceholder sx={{ height: 34 }} m={3} />
      <LoadingPlaceholder sx={{ height: 34 }} m={3} />
      <LoadingPlaceholder sx={{ height: 34 }} m={3} />
      <LoadingPlaceholder sx={{ height: 34 }} m={3} />
      <LoadingPlaceholder sx={{ height: 34 }} m={3} />
      <LoadingPlaceholder sx={{ height: 34 }} m={3} />
    </Box>
  )
}

export default PageAddGuardian
