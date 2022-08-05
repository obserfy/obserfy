import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Button, Card, Flex } from "theme-ui"
import usePatchPlan from "../../hooks/api/plans/usePatchPlans"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Icon from "../Icon/Icon"
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"
import MultilineDataBox from "../MultilineDataBox/MultilineDataBox"
import { Typography } from "../Typography/Typography"

const LessonPlanDescriptionCard: FC<{
  planId: string
  description?: string
}> = ({ description, planId }) => {
  const editor = useVisibilityState()

  if (editor.visible) {
    return (
      <DescriptionEditor
        lessonPlanId={planId}
        onDismiss={editor.hide}
        onSave={editor.hide}
        initialValue={description}
      />
    )
  }

  return (
    <Card mb={3} pb={2} sx={{ borderRadius: [0, "default"] }}>
      <MultilineDataBox
        label={t`Description`}
        value={description || ""}
        onEditClick={editor.show}
        placeholder="-"
      />
    </Card>
  )
}

const DescriptionEditor: FC<{
  initialValue?: string
  onDismiss: () => void
  onSave: () => void
  lessonPlanId: string
}> = ({ lessonPlanId, onDismiss, onSave, initialValue = "" }) => {
  const [value, setValue] = useState(initialValue)
  const { mutateAsync } = usePatchPlan(lessonPlanId)

  const handleSave = async () => {
    try {
      const result = await mutateAsync({ description: value })
      if (result?.ok) onSave()
      onSave()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Card mb={3} sx={{ borderRadius: [0, "default"], overflow: "hidden" }}>
      <Flex py={3} sx={{ alignItems: "center" }}>
        <Typography.Body px={3} sx={{ fontWeight: "bold" }}>
          <Trans>Description</Trans>
        </Typography.Body>

        <Button variant="outline" ml="auto" p={1} mr={2} onClick={onDismiss}>
          <Icon as={CloseIcon} fill="danger" />
        </Button>

        <Button
          mr={3}
          sx={{ fontWeight: "bold", fontSize: 0 }}
          onClick={handleSave}
        >
          <Trans>Save</Trans>
        </Button>
      </Flex>

      <MarkdownEditor value={value} onChange={setValue} />
    </Card>
  )
}

export default LessonPlanDescriptionCard
