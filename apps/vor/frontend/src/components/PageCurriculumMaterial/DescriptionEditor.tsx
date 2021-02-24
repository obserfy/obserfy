import { Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { borderBottom } from "../../border"
import usePatchMaterial from "../../hooks/api/curriculum/usePatchMaterial"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { ReactComponent as MarkdownIcon } from "../../icons/markdown.svg"
import Icon from "../Icon/Icon"
import Markdown from "../Markdown/Markdown"
import { TextArea } from "../TextArea/TextArea"
import { Typography } from "../Typography/Typography"

const DescriptionEditor: FC<{
  initialValue?: string
  materialId: string
  onDismiss: () => void
  onSave: () => void
}> = ({ materialId, onDismiss, onSave, initialValue = "" }) => {
  const [value, setValue] = useState(initialValue)
  const [showPreview, setShowPreview] = useState(false)
  const patchMaterial = usePatchMaterial(materialId)

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
      <Flex px={2} sx={{ alignItems: "center", ...borderBottom }}>
        <Typography.Body
          as="button"
          px={3}
          pt={2}
          pb={2}
          onClick={() => setShowPreview(false)}
          sx={{
            ...borderBottom,
            borderColor: "primary",
            borderBottomWidth: 2,
            borderStyle: !showPreview ? "solid" : "none",
            color: !showPreview ? "textPrimary" : "textMediumEmphasis",
            fontWeight: "bold",
            outline: "none",
            "&:hover": { backgroundColor: "primaryLightest" },
          }}
        >
          <Trans>Write</Trans>
        </Typography.Body>
        <Typography.Body
          as="button"
          px={3}
          pt={2}
          pb={2}
          sx={{
            ...borderBottom,
            borderColor: "primary",
            borderBottomWidth: 2,
            borderStyle: showPreview ? "solid" : "none",
            color: showPreview ? "textPrimary" : "textMediumEmphasis",
            outline: "none",
            "&:hover": { backgroundColor: "primaryLightest" },
          }}
          onClick={() => setShowPreview(true)}
        >
          <Trans>Preview</Trans>
        </Typography.Body>

        <Icon
          as={MarkdownIcon}
          ml="auto"
          mr={2}
          mt={2}
          mb={2}
          sx={{ color: "textMediumEmphasis" }}
        />

        <Typography.Body
          pr={3}
          mt={2}
          mb={2}
          sx={{ fontSize: 0, color: "textMediumEmphasis", lineHeight: 1 }}
        >
          <Trans>Markdown Supported</Trans>
        </Typography.Body>
      </Flex>

      {showPreview ? (
        <Box
          p={3}
          sx={{
            backgroundColor: "darkSurface",
            borderBottomLeftRadius: "default",
            borderBottomRightRadius: "default",
            minHeight: 408,
          }}
        >
          <Markdown markdown={value} />
        </Box>
      ) : (
        <Box
          px={2}
          pb={2}
          sx={{
            backgroundColor: "darkSurface",
            borderBottomLeftRadius: "default",
            borderBottomRightRadius: "default",
          }}
        >
          <TextArea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write something"
            sx={{
              border: "none",
              backgroundColor: "darkSurface",
              minHeight: 400,
            }}
          />
        </Box>
      )}
    </Card>
  )
}

export default DescriptionEditor
