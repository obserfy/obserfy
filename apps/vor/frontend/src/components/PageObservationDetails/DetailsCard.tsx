import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Button, Card, Flex } from "theme-ui"
import { borderBottom } from "../../border"
import usePatchObservation from "../../hooks/api/observations/usePatchObservation"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Icon from "../Icon/Icon"
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"
import MultilineDataBox from "../MultilineDataBox/MultilineDataBox"
import { Typography } from "../Typography/Typography"

interface Props {
  originalValue: string
  observationId: string
}
const DetailsCard: FC<Props> = ({ originalValue, observationId }) => (
  <LongTextDataBox
    originalValue={originalValue}
    observationId={observationId}
  />
)

const LongTextDataBox: FC<{
  originalValue?: string
  observationId: string
}> = ({ originalValue, observationId }) => {
  const editor = useVisibilityState()

  if (editor.visible) {
    return (
      <DetailEditor
        onDismiss={editor.hide}
        onSave={editor.hide}
        observationId={observationId}
        initialValue={originalValue}
      />
    )
  }

  return (
    <Card variant="responsive" mb={3} pb={2}>
      <MultilineDataBox
        label={t`Details`}
        value={originalValue ?? ""}
        onEditClick={editor.show}
        placeholder="-"
      />
    </Card>
  )
}

const DetailEditor: FC<{
  initialValue?: string
  onDismiss: () => void
  onSave: () => void
  observationId: string
}> = ({ observationId, onDismiss, onSave, initialValue = "" }) => {
  const [value, setValue] = useState(initialValue)
  const patchObservation = usePatchObservation(observationId)

  const handleSave = async () => {
    try {
      await patchObservation.mutateAsync({ longDesc: value })
      onSave()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Card variant="responsive" mb={3} sx={{ overflow: "hidden" }}>
      <Flex pt={3} pb={3} sx={{ ...borderBottom, alignItems: "center" }}>
        <Typography.Body px={3} sx={{ fontWeight: "bold" }}>
          <Trans>Details</Trans>
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

export default DetailsCard
