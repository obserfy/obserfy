import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import { Trans } from "@lingui/macro"
import { navigate } from "../Link/Link"
import { STUDENTS_URL } from "../../routes"
import { usePostNewStudent } from "../../api/students/usePostNewStudent"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import {
  NewStudentForm,
  newStudentFormDefaultState,
  useNewStudentFormContext,
} from "./NewStudentForm"
import { borderBottom } from "../../border"

export const PageNewStudent: FC = () => {
  const { state, setState } = useNewStudentFormContext()
  const [mutate, { isLoading }] = usePostNewStudent()
  const isFormInvalid = state.name === ""

  return (
    <>
      <TranslucentBar boxSx={{ position: "sticky", top: 0, ...borderBottom }}>
        <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} m="auto">
          <BackButton to={STUDENTS_URL} />
          <Breadcrumb>
            <BreadcrumbItem to={STUDENTS_URL}>
              <Trans>Students</Trans>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Trans>Create New</Trans>
            </BreadcrumbItem>
          </Breadcrumb>
          <Button
            ml="auto"
            p={isLoading ? 1 : 2}
            my={2}
            mr={3}
            disabled={isFormInvalid}
            onClick={async () => {
              const result = await mutate(state)
              if (result?.ok) {
                setState(() => newStudentFormDefaultState)
                await navigate(STUDENTS_URL)
              }
            }}
          >
            {isLoading ? <LoadingIndicator size={22} /> : "Save"}
          </Button>
        </Flex>
      </TranslucentBar>

      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4} pt={3}>
        <NewStudentForm />

        <Button
          variant="outline"
          mr={3}
          my={3}
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
