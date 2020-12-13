import { t, Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Box, Button } from "theme-ui"
import { usePostNewStudent } from "../../hooks/api/students/usePostNewStudent"
import { NEW_STUDENT_URL, STUDENTS_URL } from "../../routes"
import { navigate } from "../Link/Link"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { breadCrumb } from "../TopBar/TopBar"
import TopBarWithAction from "../TopBarWithAction/TopBarWithAction"
import {
  NewStudentForm,
  newStudentFormDefaultState,
  useNewStudentFormContext,
} from "./NewStudentForm"

export const PageNewStudent: FC = () => {
  const { state, setState } = useNewStudentFormContext()
  const [mutate, { isLoading }] = usePostNewStudent()
  const isFormInvalid = state.name === ""

  return (
    <>
      <TopBarWithAction
        disableAction={isFormInvalid}
        breadcrumbs={[
          breadCrumb(t`Students`, STUDENTS_URL),
          breadCrumb("New Student", NEW_STUDENT_URL),
        ]}
        onActionClick={async () => {
          const result = await mutate(state)
          if (result?.ok) {
            setState(() => newStudentFormDefaultState)
            await navigate(STUDENTS_URL)
          }
        }}
        buttonContent={
          isLoading ? <LoadingIndicator size={22} /> : <Trans>Save</Trans>
        }
      />

      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4} pt={3}>
        <NewStudentForm />

        <Button
          variant="outline"
          mr={3}
          my={4}
          ml="auto"
          color="danger"
          onClick={() => {
            setState(() => newStudentFormDefaultState)
            window.scrollTo({ top: 0 })
          }}
        >
          <Trans>Reset Form</Trans>
        </Button>
      </Box>
    </>
  )
}

export default PageNewStudent
