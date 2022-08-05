import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Flex } from "theme-ui"
import { usePostNewGuardian } from "../../hooks/api/guardians/usePostNewGuardian"
import { GuardianRelationship } from "../../hooks/api/students/usePostNewStudent"
import { NEW_STUDENT_URL, STUDENTS_URL } from "../../routes"
import Chip from "../Chip/Chip"
import GuardianRelationshipSelector from "../GuardianRelationshipSelector/GuardianRelationshipSelector"
import { navigate } from "../Link/Link"
import NewGuardianForm, {
  useNewGuardianFormState,
} from "../NewGuardianForm/NewGuardianForm"
import { useNewStudentFormContext } from "../PageNewStudent/NewStudentFormContext"
import SimpleGuardiansSelector from "../SimpleGuardiansSelector/SimpleGuardiansSelector"
import { breadCrumb } from "../TopBar/TopBar"
import TopBarWithAction from "../TopBarWithAction/TopBarWithAction"
import { Typography } from "../Typography/Typography"

enum Mode {
  NEW,
  EXISTING,
}

const PageNewStudentAddGuardian: FC = () => {
  const { state, setState } = useNewStudentFormContext()
  const postNewGuardian = usePostNewGuardian()
  const [mode, setMode] = useState(Mode.NEW)

  const [relation, setRelation] = useState(GuardianRelationship.Mother)
  const [newGuardian, setNewGuardian] = useNewGuardianFormState()
  const [guardianId, setGuardianId] = useState("")

  const isFormValid =
    mode === Mode.NEW ? newGuardian.name !== "" : guardianId !== ""

  const createNewGuardian = async () => {
    try {
      const result = await postNewGuardian.mutateAsync(newGuardian)
      const { id } = await result.json()
      setState((draft) => {
        draft.guardians.push({ id, relationship: relation })
      })
      await navigate(NEW_STUDENT_URL)
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const createNewGuardianRelation = async () => {
    setState((draft) => {
      draft.guardians.push({ id: guardianId, relationship: relation })
    })
    await navigate(NEW_STUDENT_URL)
  }

  return (
    <>
      <TopBarWithAction
        disableAction={!isFormValid}
        onActionClick={async () => {
          if (mode === Mode.NEW) await createNewGuardian()
          else await createNewGuardianRelation()
        }}
        breadcrumbs={[
          breadCrumb(t`Students`, STUDENTS_URL),
          breadCrumb(t`New Student`, NEW_STUDENT_URL),
          breadCrumb(t`Add Guardian`),
        ]}
        isLoading={postNewGuardian.isLoading}
      />

      <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
        <Typography.H5 mx={3} mt={4} mb={2}>
          <Trans>Add Guardian</Trans>
        </Typography.H5>

        <ModeSelector mode={mode} onClick={setMode} />

        <GuardianRelationshipSelector
          value={relation}
          onChange={(e) => setRelation(parseInt(e.target.value, 10))}
        />

        {mode === Mode.NEW && (
          <NewGuardianForm
            newGuardian={newGuardian}
            onChange={setNewGuardian}
          />
        )}
        {mode === Mode.EXISTING && (
          <SimpleGuardiansSelector
            onChange={setGuardianId}
            selectedId={guardianId}
            currentGuardianIds={state.guardians.map(({ id }) => id)}
          />
        )}
      </Box>
    </>
  )
}

const ModeSelector: FC<{
  mode: Mode
  onClick: (mode: Mode) => void
}> = ({ mode, onClick }) => (
  <Flex mb={3}>
    <Chip
      text="Create new"
      ml={3}
      isActive={mode === Mode.NEW}
      onClick={() => onClick(Mode.NEW)}
    />
    <Chip
      text="From existing"
      ml={2}
      isActive={mode === Mode.EXISTING}
      onClick={() => onClick(Mode.EXISTING)}
    />
  </Flex>
)

export default PageNewStudentAddGuardian
