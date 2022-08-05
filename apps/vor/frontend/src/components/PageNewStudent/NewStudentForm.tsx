import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { borderTop } from "../../border"
import useGetSchoolClasses from "../../hooks/api/classes/useGetSchoolClasses"
import { useGetGuardian } from "../../hooks/api/guardians/useGetGuardian"
import {
  Gender,
  GuardianRelationship,
} from "../../hooks/api/students/usePostNewStudent"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import { CLASS_SETTINGS_URL, NEW_STUDENT_ADD_GUARDIAN_URL } from "../../routes"
import Chip from "../Chip/Chip"
import DateInput from "../DateInput/DateInput"
import GuardianRelationshipPill from "../GuardianRelationshipPill/GuardianRelationshipPill"
import Icon from "../Icon/Icon"
import InformationalCard from "../InformationalCard/InformationalCard"
import Input from "../Input/Input"
import { Link } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import ProfilePicker from "../ProfilePicker/ProfilePicker"
import Select from "../Select/Select"
import TextArea from "../TextArea/TextArea"
import { Typography } from "../Typography/Typography"
import WarningDialog from "../WarningDialog/WarningDialog"
import { useNewStudentFormContext } from "./NewStudentFormContext"

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

      <Card mt={4} mx={[0, 3]} sx={{ borderRadius: [0, "default"] }}>
        <Typography.H6 p={3}>
          <Trans>Classes</Trans>
        </Typography.H6>

        {classes.isLoading && <ClassesLoadingPlaceholder />}

        {classes.isSuccess && (
          <Flex sx={{ ...borderTop }} px={3}>
            {classes.data?.map((item) => {
              const selected = state.classes.includes(item.id)
              return (
                <Chip
                  mr={2}
                  my={3}
                  key={item.id}
                  text={item.name}
                  activeBackground="primary"
                  isActive={selected}
                  backgroundColor="background"
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

        {classes.isSuccess && classes.data && classes.data.length === 0 && (
          <InformationalCard
            buttonText={t`Go to Class Settings`}
            message={t` Create your first class to track your student's class enrollment.`}
            to={CLASS_SETTINGS_URL}
            containerSx={{ borderRadius: 0, mt: 0 }}
          />
        )}
      </Card>

      <Card mx={[0, 3]} sx={{ borderRadius: [0, "default"] }} mt={4}>
        <Flex sx={{ alignItems: "center" }} p={3}>
          <Typography.H6 mr="auto">
            <Trans>Guardians</Trans>
          </Typography.H6>
          <Link to={NEW_STUDENT_ADD_GUARDIAN_URL} data-cy="add-guardian">
            <Button variant="text">
              <Trans>Add</Trans>
            </Button>
          </Link>
        </Flex>

        {state.guardians.length === 0 && (
          <Typography.Body p={3} color="textMediumEmphasis">
            <Trans>This student doesn&apos;t have a guardian yet.</Trans>
          </Typography.Body>
        )}

        {state.guardians.map((guardian, idx) => (
          <Guardian
            key={guardian.id}
            id={guardian.id}
            relationship={guardian.relationship}
            onRemove={() => {
              setState((draft) => {
                draft.guardians.splice(idx, 1)
              })
            }}
          />
        ))}
      </Card>
    </>
  )
}

const Guardian: FC<{
  id: string
  relationship: GuardianRelationship
  onRemove: () => void
}> = ({ id, relationship, onRemove }) => {
  const guardian = useGetGuardian(id)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  return (
    <Flex px={3} py={2} sx={{ alignItems: "center", ...borderTop }}>
      <Flex sx={{ width: "100%", alignItems: "center" }} mr={3}>
        <GuardianRelationshipPill
          mr={3}
          relationship={relationship}
          sx={{ display: ["none", "block"] }}
        />
        <Typography.Body>{guardian.data?.name}</Typography.Body>
      </Flex>
      <Typography.Body
        py={1}
        px={2}
        ml="auto"
        sx={{
          borderRadius: "default",
          fontWeight: guardian.data?.email ? "normal" : "bold",
          width: "80%",
          backgroundColor: guardian.data?.email ? undefined : "tintWarning",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {guardian.data?.email || "No Email Set"}
      </Typography.Body>
      <Button
        data-cy={`delete-${guardian.data?.name ?? ""}`}
        p={2}
        variant="text"
        ml={2}
        onClick={() => setShowRemoveDialog(true)}
        sx={{ flexShrink: 0 }}
      >
        <Icon as={TrashIcon} size={20} />
      </Button>
      {showRemoveDialog && (
        <WarningDialog
          onDismiss={() => setShowRemoveDialog(false)}
          title={t`Remove Guardian?`}
          description={t`Are you sure you want to remove ${guardian.data?.name} from the list of guardians?`}
          onAccept={() => {
            onRemove()
            setShowRemoveDialog(false)
          }}
        />
      )}
    </Flex>
  )
}

const ClassesLoadingPlaceholder: FC = () => (
  <Flex m={3}>
    <LoadingPlaceholder mr={3} sx={{ width: 42, height: "2rem" }} />
  </Flex>
)
