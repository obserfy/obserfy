import React, { createContext, FC, useContext, useState } from "react"
import { t, Trans } from "@lingui/macro"
import { Box, Button, Card, Flex } from "theme-ui"
import { useLingui } from "@lingui/react"
import { Updater, useImmer } from "use-immer"
import { Dayjs } from "../../dayjs"
import { Typography } from "../Typography/Typography"
import ProfilePicker from "../ProfilePicker/ProfilePicker"
import Input from "../Input/Input"
import DateInput from "../DateInput/DateInput"
import Select from "../Select/Select"
import {
  Gender,
  GuardianRelationship,
} from "../../api/students/usePostNewStudent"
import TextArea from "../TextArea/TextArea"
import EmptyClassDataPlaceholder from "../EmptyClassDataPlaceholder/EmptyClassDataPlaceholder"
import Chip from "../Chip/Chip"
import { Link } from "../Link/Link"
import { NEW_STUDENT_ADD_GUARDIAN_URL } from "../../routes"
import useGetSchoolClasses from "../../api/classes/useGetSchoolClasses"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { useGetGuardian } from "../../api/guardians/useGetGuardian"
import GuardianRelationshipPill from "../GuardianRelationshipPill/GuardianRelationshipPill"
import Icon from "../Icon/Icon"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import WarningDialog from "../WarningDialog/WarningDialog"
import GuardianRelationshipPickerDialog from "../GuardianRelationshipPickerDialog/GuardianRelationshipPickerDialog"

export const newStudentFormDefaultState = {
  classes: [] as string[],
  guardians: [] as Array<{
    id: string
    relationship: GuardianRelationship
  }>,
  dateOfEntry: undefined as Dayjs | undefined,
  dateOfBirth: undefined as Dayjs | undefined,
  gender: 0,
  note: "",
  customId: "",
  profileImageId: "",
  name: "",
}

// Context to persist and share form state across pages
const NewStudentFormContext = createContext({
  state: newStudentFormDefaultState,
  setState: (() => {}) as Updater<typeof newStudentFormDefaultState>,
})

export const NewStudentFormProvider: FC = ({ children }) => {
  const [state, setState] = useImmer(newStudentFormDefaultState)

  return (
    <NewStudentFormContext.Provider value={{ state, setState }}>
      {children}
    </NewStudentFormContext.Provider>
  )
}

export const useNewStudentFormContext = () => useContext(NewStudentFormContext)

export const NewStudentForm = () => {
  const { i18n } = useLingui()
  const classes = useGetSchoolClasses()
  const { state, setState } = useNewStudentFormContext()

  return (
    <>
      <Box mx={3}>
        <Flex sx={{ alignItems: "flex-end" }}>
          <Typography.H5 mb={3}>
            <Trans>New Student</Trans>
          </Typography.H5>
          <ProfilePicker
            ml="auto"
            mb={2}
            value={state.profileImageId}
            onChange={(id) =>
              setState((draft) => {
                draft.profileImageId = id
              })
            }
          />
        </Flex>
        <Input
          label={t`Name (Required)`}
          sx={{ width: "100%" }}
          value={state.name}
          onChange={(e) =>
            setState((draft) => {
              draft.name = e.target.value
            })
          }
          mb={3}
        />
        <DateInput
          mb={3}
          label={t`Date of Birth`}
          value={state.dateOfBirth}
          onChange={(dateOfBirth) =>
            setState((draft) => {
              draft.dateOfBirth = dateOfBirth
            })
          }
        />
        <DateInput
          mb={3}
          label={t`Date of Entry`}
          value={state.dateOfEntry}
          onChange={(dateOfEntry) =>
            setState((draft) => {
              draft.dateOfEntry = dateOfEntry
            })
          }
        />
        <Select
          label={t`Gender`}
          mb={3}
          value={state.gender}
          onChange={(e) =>
            setState((draft) => {
              draft.gender = parseInt(e.target.value, 10)
            })
          }
        >
          <option value={Gender.NotSet}>{i18n._(t`Not Set`)}</option>
          <option value={Gender.Male}>{i18n._(t`Male`)}</option>
          <option value={Gender.Female}>{i18n._(t`Female`)}</option>
        </Select>
        <Input
          mb={3}
          label={t`Student ID`}
          sx={{ width: "100%" }}
          value={state.customId}
          onChange={(e) =>
            setState((draft) => {
              draft.customId = e.target.value
            })
          }
        />
        <TextArea
          label={t`Notes`}
          sx={{ height: 100 }}
          value={state.note}
          onChange={(e) =>
            setState((draft) => {
              draft.note = e.target.value
            })
          }
        />
      </Box>
      <Typography.H5 m={3} mt={4}>
        <Trans>Classes</Trans>
      </Typography.H5>
      {classes.status === "success" && (classes.data?.length ?? 0) === 0 && (
        <EmptyClassDataPlaceholder />
      )}
      {classes.status === "loading" && <ClassesLoadingPlaceholder />}
      {classes.status !== "error" && (
        <Flex m={3}>
          {classes.data?.map((item) => {
            const selected = state.classes.includes(item.id)
            return (
              <Chip
                mr={2}
                mb={2}
                key={item.id}
                text={item.name}
                activeBackground="primary"
                isActive={selected}
                onClick={() => {
                  if (selected) {
                    setState((draft) => {
                      draft.classes = draft.classes.filter(
                        (selection) => selection !== item.id
                      )
                    })
                  } else {
                    setState((draft) => {
                      draft.classes.push(item.id)
                    })
                  }
                }}
              />
            )
          })}
        </Flex>
      )}
      <Flex sx={{ alignItems: "center" }} mt={3}>
        <Typography.H5 m={3} mr="auto">
          <Trans>Guardians</Trans>
        </Typography.H5>
        <Link to={NEW_STUDENT_ADD_GUARDIAN_URL} data-cy="add-student">
          <Button variant="outline" mr={3}>
            <Trans>Add</Trans>
          </Button>
        </Link>
      </Flex>
      {state.guardians.length === 0 && (
        <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]}>
          <Typography.Body m={3} color="textMediumEmphasis">
            <Trans>This student doesn&apos;t have a guardian yet.</Trans>
          </Typography.Body>
        </Card>
      )}
      {state.guardians.map((guardian, idx) => (
        <GuardianCard
          key={guardian.id}
          id={guardian.id}
          relationship={guardian.relationship}
          changeRelationship={(relationship) => {
            setState((draft) => {
              draft.guardians[idx].relationship = relationship
            })
          }}
          onRemove={() => {
            setState((draft) => {
              draft.guardians.splice(idx, 1)
            })
          }}
        />
      ))}
    </>
  )
}

const GuardianCard: FC<{
  id: string
  relationship: GuardianRelationship
  changeRelationship: (relationship: GuardianRelationship) => void
  onRemove: () => void
}> = ({ id, relationship, onRemove, changeRelationship }) => {
  const guardian = useGetGuardian(id)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [showRelationshipDialog, setShowRelationShipDialog] = useState(false)

  return (
    <Card
      py={3}
      pr={2}
      mb={2}
      mx={[0, 3]}
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: [0, "default"],
      }}
    >
      <Flex
        onClick={() => setShowRelationShipDialog(true)}
        sx={{
          flexDirection: "column",
          width: "100%",
          alignItems: "start",
        }}
      >
        <Typography.Body sx={{ lineHeight: 1 }} mb={3} ml={3}>
          {guardian.data?.name}
        </Typography.Body>
        <GuardianRelationshipPill relationship={relationship} ml={3} />
      </Flex>
      <Button
        variant="secondary"
        ml="auto"
        onClick={() => setShowRemoveDialog(true)}
      >
        <Icon as={TrashIcon} />
      </Button>
      {showRemoveDialog && (
        <WarningDialog
          onDismiss={() => setShowRemoveDialog(false)}
          title="Remove Guardian?"
          description={`Are you sure you want to remove ${guardian.data?.name} from the list of guardians?`}
          onAccept={() => {
            onRemove()
            setShowRemoveDialog(false)
          }}
        />
      )}
      {showRelationshipDialog && (
        <GuardianRelationshipPickerDialog
          defaultValue={relationship}
          onAccept={(newRelationship) => {
            changeRelationship(newRelationship)
            setShowRelationShipDialog(false)
          }}
          onDismiss={() => {
            setShowRelationShipDialog(false)
          }}
        />
      )}
    </Card>
  )
}

const ClassesLoadingPlaceholder: FC = () => (
  <Box m={3}>
    <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} />
  </Box>
)
