import React, { FC, useState } from "react"
import { navigate } from "gatsby-plugin-intl3"
import { useImmer } from "use-immer"
import nanoid from "nanoid"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import Input from "../Input/Input"
import Button from "../Button/Button"
import { createStudentApi } from "../../api/students/createStudentApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { getAnalytics } from "../../analytics"
import DateInput from "../DateInput/DateInput"
import TextArea from "../TextArea/TextArea"
import { Typography } from "../Typography/Typography"
import Select from "../Select/Select"
import useGetSchoolClasses from "../../api/useGetSchoolClasses"
import Chip from "../Chip/Chip"
import { Flex } from "../Flex/Flex"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import InformationalCard from "../InformationalCard/InformationalCard"
import { CLASS_SETTINGS_URL } from "../../pages/dashboard/settings/class"
import Card from "../Card/Card"
import { Icon } from "../Icon/Icon"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"

enum GuardianRelationship {
  Mother,
  Father,
  Other,
}

interface Guardian {
  id: string
  guardianName: string
  email: string
  phone: string
  guardianNote: string
  relationship: GuardianRelationship
}

export const PageNewStudent: FC = () => {
  const [name, setName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [note, setNotes] = useState("")
  const [gender, setGender] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [entryDate, setEntryDate] = useState<Date>()
  const [guardians, setGuardians] = useImmer<Guardian[]>([])
  const classes = useGetSchoolClasses()
  const isFormInvalid = name === ""

  async function createNewStudent(): Promise<void> {
    const response = await createStudentApi(getSchoolId(), {
      name,
      dateOfBirth,
    })
    getAnalytics()?.track("Student Created", {
      responseStatus: response.status,
      studentName: name,
    })
    if (response.status === 201) navigate("/dashboard/observe")
  }

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={4}>
        <BackNavigation to="/dashboard/observe" text="Home" />
        <Typography.H4 m={3}>New Student</Typography.H4>
        <Box mx={3} mt={3}>
          <Input
            label="Name (Required)"
            width="100%"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb={3}
          />
          <DateInput
            label="Date of Birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            mb={3}
          />
          <DateInput
            label="Entry Date"
            value={entryDate}
            onChange={setEntryDate}
            mb={3}
          />
          <Select
            label="Gender"
            mb={3}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="0">Not Set</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </Select>
          <Input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            label="Student ID"
            width="100%"
            mb={3}
          />
          <TextArea
            value={note}
            onChange={(e) => setNotes(e.target.value)}
            label="Notes"
            height={100}
          />
        </Box>
        <Typography.H5 m={3} mt={4}>
          CLASSES
        </Typography.H5>
        {classes.status === "success" && classes.data.length === 0 && (
          <EmptyClassDataPlaceholder />
        )}
        {classes.status === "loading" && <ClassesLoadingPlaceholder />}
        {classes.status !== "error" && (
          <Flex m={3}>
            {classes.data?.map((item) => (
              <Chip key={item.id} text={item.name} activeBackground="primary" />
            ))}
          </Flex>
        )}
        <Flex alignItems="center" mt={3}>
          <Typography.H5 m={3}>GUARDIANS</Typography.H5>
          <Button
            variant="outline"
            ml="auto"
            mr={3}
            onClick={() =>
              setGuardians((draft) => {
                draft.push({
                  id: nanoid(),
                  email: "",
                  guardianName: "",
                  guardianNote: "",
                  phone: "",
                  relationship: GuardianRelationship.Mother,
                })
              })
            }
          >
            Add
          </Button>
        </Flex>
        {guardians.length === 0 && (
          <Card borderRadius={[0, "default"]}>
            <Typography.Body m={3} color="textMediumEmphasis">
              This student doesn&apos;t have a guardian yet.
            </Typography.Body>
          </Card>
        )}
        {guardians.map(
          ({ guardianName, email, guardianNote, phone }, index) => (
            <Box p={3}>
              <Flex alignItems="center" mb={2}>
                <Typography.H6>Guardian {index + 1}</Typography.H6>
                <Button variant="outline" ml="auto">
                  <Icon as={TrashIcon} m={0} fill="danger" />
                </Button>
              </Flex>
              <Input
                small
                value={guardianName}
                mb={2}
                label="Name"
                width="100%"
              />
              <Input small value={email} mb={2} label="Email" width="100%" />
              <Input small value={phone} mb={2} label="Phone" width="100%" />
              <TextArea
                value={guardianNote}
                label="Note"
                width="100%"
                height={100}
              />
            </Box>
          )
        )}
        <Box p={3} mt={3}>
          <Button
            width="100%"
            onClick={createNewStudent}
            disabled={isFormInvalid}
          >
            Save
          </Button>
        </Box>
      </Box>
    </>
  )
}

const ClassesLoadingPlaceholder: FC = () => (
  <Box m={3}>
    <LoadingPlaceholder width="100%" height="4rem" />
  </Box>
)

const EmptyClassDataPlaceholder: FC = () => (
  <InformationalCard
    buttonText="Go to Class Settings"
    message="Create your first class to track your student's class enrollment."
    to={CLASS_SETTINGS_URL}
  />
)

export default PageNewStudent
