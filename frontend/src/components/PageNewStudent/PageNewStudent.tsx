import React, { FC, useCallback, useState } from "react"
import { useImmer } from "use-immer"
import { Link, navigate } from "gatsby-plugin-intl3"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import Input from "../Input/Input"
import Button from "../Button/Button"
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
import ProfilePicker from "../ProfilePicker/ProfilePicker"
import { Gender, usePostNewStudent } from "../../api/students/usePostNewStudent"
import { PICK_GUARDIAN_URL } from "../../pages/dashboard/observe/students/guardians/pick"
import {
  useCacheNewStudentFormData,
  useGetNewStudentFormCache,
} from "./newStudentFormCache"

export interface NewStudentFormData {
  name: string
  picture?: File
  customId: string
  note: string
  gender: Gender
  dateOfBirth?: Date
  dateOfEntry?: Date
  guardians: string[]
  selectedClasses: string[]
}

const DEFAULT_FORM_STATE: NewStudentFormData = {
  selectedClasses: [],
  guardians: [],
  dateOfEntry: undefined,
  dateOfBirth: undefined,
  gender: 0,
  note: "",
  customId: "",
  picture: undefined,
  name: "",
}

export const PageNewStudent: FC = () => {
  const [name, setName] = useState("")
  const [picture, setPicture] = useState<File>()
  const [customId, setCustomId] = useState("")
  const [note, setNotes] = useState("")
  const [gender, setGender] = useState<Gender>(Gender.NotSet)
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [dateOfEntry, setDateOfEntry] = useState<Date>()
  const [guardians, setGuardians] = useImmer<string[]>([])
  const [selectedClasses, setSelectedClasses] = useImmer<string[]>([])
  const [mutate] = usePostNewStudent()
  const classes = useGetSchoolClasses()
  const isFormInvalid = name === ""

  useCacheNewStudentFormData({
    name,
    picture,
    customId,
    note,
    gender,
    dateOfBirth,
    dateOfEntry,
    guardians,
    selectedClasses,
  })

  const updateAllFormState = useCallback(
    (cachedData: NewStudentFormData) => {
      setName(cachedData.name)
      setPicture(cachedData.picture)
      setCustomId(cachedData.customId)
      setNotes(cachedData.note)
      setGender(cachedData.gender)
      setDateOfBirth(cachedData.dateOfBirth)
      setDateOfEntry(cachedData.dateOfEntry)
      setGuardians(() => cachedData.guardians)
      setSelectedClasses(() => cachedData.selectedClasses)
    },
    [setGuardians, setSelectedClasses]
  )
  useGetNewStudentFormCache(updateAllFormState)

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={4}>
        <BackNavigation to="/dashboard/observe" text="Home" />
        <Box mx={3}>
          <Flex alignItems="flex-end">
            <Typography.H4 mb={3}>New Student</Typography.H4>
            <ProfilePicker
              ml="auto"
              onChange={setPicture}
              value={picture}
              mb={2}
            />
          </Flex>
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
            label="Date of Entry"
            value={dateOfEntry}
            onChange={setDateOfEntry}
            mb={3}
          />
          <Select
            label="Gender"
            mb={3}
            value={gender}
            onChange={(e) => setGender(parseInt(e.target.value, 10))}
          >
            <option value={Gender.NotSet}>Not Set</option>
            <option value={Gender.Male}>Male</option>
            <option value={Gender.Female}>Female</option>
          </Select>
          <Input
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
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
            {classes.data?.map((item) => {
              const selected = selectedClasses.includes(item.id)
              return (
                <Chip
                  key={item.id}
                  text={item.name}
                  activeBackground="primary"
                  isActive={selected}
                  onClick={() => {
                    if (selected) {
                      setSelectedClasses((draft) => {
                        return draft.filter(
                          (selection) => selection !== item.id
                        )
                      })
                    } else {
                      setSelectedClasses((draft) => {
                        draft.push(item.id)
                      })
                    }
                  }}
                />
              )
            })}
          </Flex>
        )}
        <Flex alignItems="center" mt={3}>
          <Typography.H5 m={3} mr="auto">
            GUARDIANS
          </Typography.H5>
          <Link to={PICK_GUARDIAN_URL}>
            <Button variant="outline" mr={3}>
              Add
            </Button>
          </Link>
        </Flex>
        {guardians.length === 0 && (
          <Card borderRadius={[0, "default"]} mx={[0, 3]}>
            <Typography.Body m={3} color="textMediumEmphasis">
              This student doesn&apos;t have a guardian yet.
            </Typography.Body>
          </Card>
        )}
        <Flex p={3} mt={3}>
          <Button
            variant="outline"
            mr={3}
            color="danger"
            onClick={() => {
              window.scrollTo(0, 0)
              updateAllFormState(DEFAULT_FORM_STATE)
            }}
          >
            Clear
          </Button>
          <Button
            width="100%"
            disabled={isFormInvalid}
            onClick={async () => {
              const result = await mutate({
                picture,
                student: {
                  classes: selectedClasses,
                  name,
                  customId,
                  dateOfBirth,
                  dateOfEntry,
                  guardians,
                  note,
                  gender,
                },
              })
              if (result.status === 201) {
                updateAllFormState(DEFAULT_FORM_STATE)
                await navigate("/dashboard/observe")
              }
            }}
          >
            Save
          </Button>
        </Flex>
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
  <Box mx={[0, 3]}>
    <InformationalCard
      buttonText="Go to Class Settings"
      message="Create your first class to track your student's class enrollment."
      to={CLASS_SETTINGS_URL}
    />
  </Box>
)

// export interface Guardian {
//   id: string
//   name: string
//   email: string
//   phone: string
//   note: string
//   relationship: GuardianRelationship
// }

// const GuardianForm: FC<{
//   value: Guardian
//   onChange: (newValue: Guardian) => void
//   onDelete: (id: string) => void
// }> = ({ value, onChange, onDelete }) => {
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
//
//   return (
//     <>
//       <Flex alignItems="flex-start" mb={4}>
//         <Box pl={3} pr={0} width="100%">
//           <Input
//             value={value.name}
//             mb={2}
//             label="Name"
//             width="100%"
//             onChange={(event) =>
//               onChange({
//                 ...value,
//                 name: event.target.value,
//               })
//             }
//           />
//           <Select
//             label="Relationship"
//             mb={2}
//             onChange={(e) =>
//               onChange({ ...value, relationship: parseInt(e.target.value, 10) })
//             }
//           >
//             <option value={GuardianRelationship.Other}>Other</option>
//             <option value={GuardianRelationship.Mother}>Mother</option>
//             <option value={GuardianRelationship.Father}>Father</option>
//           </Select>
//           <Input
//             type="email"
//             value={value.email}
//             mb={2}
//             label="Email"
//             width="100%"
//             onChange={(event) =>
//               onChange({
//                 ...value,
//                 email: event.target.value,
//               })
//             }
//           />
//           <Input
//             type="phone"
//             value={value.phone}
//             mb={2}
//             label="Phone"
//             width="100%"
//             onChange={(event) =>
//               onChange({
//                 ...value,
//                 phone: event.target.value,
//               })
//             }
//           />
//           <TextArea
//             value={value.note}
//             label="Notes"
//             width="100%"
//             height={100}
//             onChange={(event) =>
//               onChange({
//                 ...value,
//                 note: event.target.value,
//               })
//             }
//           />
//         </Box>
//
//         <Button
//           variant="secondary"
//           m={0}
//           p={0}
//           mt={22}
//           sx={{ flexShrink: 0 }}
//           onClick={() => setShowDeleteDialog(true)}
//         >
//           <Icon as={TrashIcon} fill="danger" />
//         </Button>
//       </Flex>
//       {showDeleteDialog && (
//         <WarningDialog
//           title="Delete Guardian?"
//           onDismiss={() => setShowDeleteDialog(false)}
//           onAccept={() => {
//             onDelete(value.id)
//             setShowDeleteDialog(false)
//           }}
//           description={`${
//             value.name === "" ? "This guardian" : value.name
//           } will be removed.`}
//         />
//       )}
//     </>
//   )
// }

export default PageNewStudent
