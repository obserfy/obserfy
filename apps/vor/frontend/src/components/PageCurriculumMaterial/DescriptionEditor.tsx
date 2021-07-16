import { Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Button, Card, Flex } from "theme-ui"
import usePatchMaterial from "../../hooks/api/curriculum/usePatchMaterial"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Icon from "../Icon/Icon"
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"
import { Typography } from "../Typography/Typography"

const useCachedValue = (key: string, initialValue: string) => {
  let cachedValue: string | null = null
  if (typeof window !== "undefined") {
    cachedValue = localStorage.getItem(key)
  }
  const [value, setValue] = useState(cachedValue ?? initialValue)

  const handleValueChange = (newValue: string) => {
    localStorage.setItem(key, newValue)
    setValue(newValue)
  }

  const clearCache = () => {
    localStorage.removeItem(key)
  }

  return { value, setValue: handleValueChange, clearCache }
}

const DescriptionEditor: FC<{
  initialValue?: string
  onDismiss: () => void
  onSave: () => void
  materialId: string
  subjectId: string
}> = ({ materialId, subjectId, onDismiss, onSave, initialValue = "" }) => {
  const { value, setValue, clearCache } = useCachedValue(
    materialId,
    initialValue
  )
  const patchMaterial = usePatchMaterial(materialId, subjectId)

  const handleSave = async () => {
    try {
      await patchMaterial.mutateAsync({ description: value })
      clearCache()
      onSave()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const handleCancel = () => {
    clearCache()
    onDismiss()
  }

  return (
    <Card variant="responsive">
      <Flex pt={3} pb={2}>
        <Typography.Body px={3} sx={{ fontWeight: "bold" }}>
          <Trans>Description</Trans>
        </Typography.Body>

        <Button variant="outline" ml="auto" p={1} mr={2} onClick={handleCancel}>
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
