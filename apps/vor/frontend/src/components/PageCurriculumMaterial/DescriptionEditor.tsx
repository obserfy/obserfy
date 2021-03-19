import { Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Button, Card, Flex } from "theme-ui"
import usePatchMaterial from "../../hooks/api/curriculum/usePatchMaterial"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Icon from "../Icon/Icon"
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"
import { Typography } from "../Typography/Typography"

const DescriptionEditor: FC<{
  initialValue?: string
  onDismiss: () => void
  onSave: () => void
  materialId: string
  subjectId: string
}> = ({ materialId, subjectId, onDismiss, onSave, initialValue = "" }) => {
  const [value, setValue] = useState(initialValue)
  const patchMaterial = usePatchMaterial(materialId, subjectId)

  const handleSave = async () => {
    try {
      const result = await patchMaterial.mutateAsync({ description: value })
      if (result?.ok) onSave()
      onSave()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Card variant="responsive">
      <Flex pt={3} pb={2}>
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

export default DescriptionEditor
