/** @jsx jsx */
import { Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { jsx, Box, Flex } from "theme-ui"
import { borderBottom } from "../../border"
import { ReactComponent as MarkdownIcon } from "../../icons/markdown.svg"
import Icon from "../Icon/Icon"
import Markdown from "../Markdown/Markdown"
import { TextArea } from "../TextArea/TextArea"
import { Typography } from "../Typography/Typography"

export interface MarkdownEditorProps {
  value?: string
  onChange: (value: string) => void
}
const MarkdownEditor: FC<MarkdownEditorProps> = ({ onChange, value = "" }) => {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div>
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

        <a
          href="https://obserfy.com/docs/markdown-support"
          sx={{
            display: "flex",
            alignItems: "center",
            ml: "auto",
            transition: "color ease-in 0.1s",
            color: "textMediumEmphasis",
            "&:hover": {
              color: "textPrimary",
            },
          }}
        >
          <Icon
            as={MarkdownIcon}
            mr={2}
            mt={2}
            mb={2}
            sx={{ color: "inherit" }}
          />

          <Typography.Body
            pr={2}
            mt={2}
            mb={2}
            sx={{ fontSize: 0, color: "inherit", lineHeight: 1 }}
          >
            <Trans>Markdown Supported</Trans>
          </Typography.Body>
        </a>
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
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write something"
            sx={{
              border: "none",
              backgroundColor: "darkSurface",
              minHeight: 400,
            }}
          />
        </Box>
      )}
    </div>
  )
}

export default MarkdownEditor
