import { FC, useState } from "react"
import { Box, Button, Flex, Card } from "theme-ui"
import { Trans, t } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { navigate } from "../Link/Link"
import BackNavigation from "../BackNavigation/BackNavigation"
import { NEW_STUDENT_URL } from "../../routes"
import Input from "../Input/Input"
import { useNewStudentFormContext } from "../PageNewStudent/NewStudentFormContext"
import Select from "../Select/Select"
import { GuardianRelationship } from "../../hooks/api/students/usePostNewStudent"
import Typography from "../Typography/Typography"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

import Icon from "../Icon/Icon"

import { usePostNewGuardian } from "../../hooks/api/guardians/usePostNewGuardian"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import {
  Guardians,
  useGetSchoolGuardians,
} from "../../hooks/api/guardians/useGetSchoolGuardians"
import TextArea from "../TextArea/TextArea"
import GuardianRelationshipPickerDialog from "../GuardianRelationshipPickerDialog/GuardianRelationshipPickerDialog"

export const PagePickGuardian: FC = () => {
  const { i18n } = useLingui()
  const guardians = useGetSchoolGuardians()
  const { setState } = useNewStudentFormContext()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [relationship, setRelationship] = useState(GuardianRelationship.Other)
  const [createNew, setCreateNew] = useState(false)
  const { mutateAsync, isLoading } = usePostNewGuardian()

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto" pb={4}>
      <BackNavigation to={NEW_STUDENT_URL} text="New Student" />
      <Box m={3}>
        <Input
          value={name}
          mb={2}
          label="Guardian Name"
          sx={{ width: "100%" }}
          onChange={(e) => setName(e.target.value)}
        />
        {createNew && (
          <>
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
              sx={{ width: "100%" }}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              type="phone"
              value={phone}
              mb={3}
              label="Phone"
              sx={{ width: "100%" }}
              onChange={(event) => setPhone(event.target.value)}
            />
            <TextArea
              mb={3}
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Flex>
              <Button
                ml="auto"
                variant="outline"
                mr={2}
                onClick={() => setCreateNew(false)}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                data-cy="save-guardian"
                disabled={name === ""}
                onClick={async () => {
                  const payload = { email, name, phone, note }
                  try {
                    const result = await mutateAsync(payload)
                    const resultJson = await result.json()
                    setState((draft) => {
                      draft.guardians.push({
                        id: resultJson.id,
                        relationship,
                      })
                    })
                    await navigate(NEW_STUDENT_URL, {
                      state: { preserveScroll: true },
                    })
                  } catch (e) {
                    Sentry.captureException(e)
                  }
                }}
              >
                {isLoading && <LoadingIndicator color="onPrimary" />}
                <Trans>Save </Trans>
              </Button>
            </Flex>
          </>
        )}
      </Box>
      {!createNew && (
        <>
          <Typography.Body mx={3} mb={2} mt={4} color="textMediumEmphasis">
            <Trans>Select a guardian or create one</Trans>
          </Typography.Body>
          {guardians.data
            ?.filter((guardian) => {
              return guardian.name
                .toLowerCase()
                .includes(name.toLocaleLowerCase())
            })
            ?.map((guardian) => (
              <GuardianCard guardian={guardian} />
            ))}
          <Card
            p={3}
            mx={[0, 3]}
            onClick={() => setCreateNew(true)}
            sx={{
              borderRadius: [0, "default"],
              display: "flex",
              alignItems: "flex-start",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "primaryLightest",
              },
            }}
          >
            <Icon as={PlusIcon} mt="5px" mr={3} fill="primary" />
            <Typography.Body>
              <Trans>Create</Trans> {name || i18n._(t`new guardian`)}
            </Typography.Body>
          </Card>
        </>
      )}
    </Box>
  )
}

const GuardianCard: FC<{ guardian: Guardians }> = ({ guardian }) => {
  const { setState } = useNewStudentFormContext()
  const [showGuardianSelector, setShowGuardianSelector] = useState(false)

  return (
    <>
      <Card
        onClick={() => setShowGuardianSelector(true)}
        p={3}
        mx={[0, 3]}
        mb={2}
        sx={{
          borderRadius: [0, "default"],
          alignItems: "flex-start",
          display: "flex",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "primaryLightest",
          },
        }}
      >
        <Typography.Body>{guardian.name}</Typography.Body>
      </Card>
      {showGuardianSelector && (
        <GuardianRelationshipPickerDialog
          onDismiss={() => setShowGuardianSelector(false)}
          onAccept={(relationship) => {
            setState((draft) => {
              draft.guardians.push({
                id: guardian.id,
                relationship,
              })
            })
            navigate(NEW_STUDENT_URL, {
              state: { preserveScroll: true },
            })
          }}
        />
      )}
    </>
  )
}

export default PagePickGuardian
