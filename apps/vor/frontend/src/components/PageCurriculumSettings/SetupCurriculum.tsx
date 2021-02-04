import { Trans } from "@lingui/macro"
import { Button, Card, Flex } from "theme-ui"
import React, { FC } from "react"
import usePostNewCurriculum from "../../hooks/api/curriculum/usePostNewCurriculum"
import useVisibilityState from "../../hooks/useVisibilityState"
import NewCustomCurriculumDialog from "../NewCustomCurriculumDialog/NewCustomCurriculumDialog"
import Typography from "../Typography/Typography"

const SetupCurriculum: FC = () => {
  const postNewCurriculum = usePostNewCurriculum()
  const newDialog = useVisibilityState()

  const handleUseMontessori = async () => {
    try {
      await postNewCurriculum.mutateAsync({ template: "montessori" })
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <>
      <Typography.H6 my={2} sx={{ textAlign: "center" }}>
        <Trans>Setup curriculum</Trans>
      </Typography.H6>
      <Flex p={3} sx={{ flexFlow: ["column", "row"] }}>
        <Card p={3} mr={[0, 3]} mb={[3, 0]} sx={{ width: [undefined, "50%"] }}>
          <Typography.H6 mb={2}>Montessori</Typography.H6>
          <Typography.Body mb={3}>
            <Trans>
              Start with a basic Montessori Curriculum that you can modify to
              your needs.
            </Trans>
          </Typography.Body>
          <Button variant="outline" onClick={handleUseMontessori}>
            <Trans>Use Montessori</Trans>
          </Button>
        </Card>
        <Card p={3} sx={{ width: [undefined, "50%"] }}>
          <Typography.H6 mb={2}>
            <Trans>Custom</Trans>
          </Typography.H6>
          <Typography.Body mb={3}>
            <Trans>
              Start with a blank curriculum that you can customize from scratch.
            </Trans>
          </Typography.Body>
          <Button variant="outline" onClick={newDialog.show}>
            <Trans>Use Custom</Trans>
          </Button>
        </Card>
      </Flex>

      {newDialog.visible && (
        <NewCustomCurriculumDialog onDismiss={newDialog.hide} />
      )}
    </>
  )
}

export default SetupCurriculum
