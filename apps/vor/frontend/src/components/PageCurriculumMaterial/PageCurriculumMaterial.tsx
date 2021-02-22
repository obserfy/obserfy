import { t, Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Box, Button, Card, Flex, ThemeUIStyleObject } from "theme-ui"
import { borderBottom } from "../../border"
import useGetMaterial from "../../hooks/api/curriculum/useGetMaterial"
import { useGetArea } from "../../hooks/api/useGetArea"
import { useGetSubject } from "../../hooks/api/useGetSubject"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_AREA_URL,
  CURRICULUM_SUBJECT_URL,
} from "../../routes"
import DataBox from "../DataBox/DataBox"
import Icon from "../Icon/Icon"
import Markdown from "../Markdown/Markdown"
import MultilineDataBox from "../MultilineDataBox/MultilineDataBox"
import { TextArea } from "../TextArea/TextArea"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import { Typography } from "../Typography/Typography"
import { ReactComponent as MarkdownIcon } from "../../icons/markdown.svg"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"

export interface PageCurriculumMaterialProps {
  sx?: ThemeUIStyleObject
  areaId: string
  subjectId: string
  materialId: string
}
const PageCurriculumMaterial: FC<PageCurriculumMaterialProps> = ({
  subjectId,
  areaId,
  materialId,
}) => {
  const area = useGetArea(areaId)
  const subject = useGetSubject(subjectId)
  const material = useGetMaterial(materialId)

  const descriptionEditor = useVisibilityState()

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.lg", width: "100%" }}>
      <TopBar
        containerSx={{ display: ["flex", "flex", "none"] }}
        breadcrumbs={[
          breadCrumb("Admin", ADMIN_URL),
          breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
          breadCrumb(area.data?.name ?? "", CURRICULUM_AREA_URL(areaId)),
          breadCrumb(
            subject.data?.name ?? "",
            CURRICULUM_SUBJECT_URL(areaId, subjectId)
          ),
          breadCrumb(material.data?.name ?? ""),
        ]}
      />

      <Box pt={[0, 0, 3]}>
        <Box px={[0, 3]}>
          <Card
            mb={3}
            sx={{
              width: "100%",
              boxSizing: "border-box",
              borderRadius: [0, "default"],
            }}
          >
            <DataBox
              label="Material Name"
              value={material.data?.name ?? "..."}
            />
          </Card>
        </Box>

        {descriptionEditor.visible ? (
          <DescriptionEditor
            onDismiss={descriptionEditor.hide}
            onSave={descriptionEditor.hide}
          />
        ) : (
          <Card variant="responsive" pb={2}>
            <MultilineDataBox
              key={material.data?.description}
              label="Description"
              value={material.data?.description ?? ""}
              placeholder={t`Not set`}
              onEditClick={descriptionEditor.show}
            />
          </Card>
        )}

        <Button
          variant="outline"
          sx={{ color: "danger" }}
          ml="auto"
          mt={3}
          mr={3}
        >
          <Icon as={DeleteIcon} mr={2} fill="danger" />
          <Trans>Delete material</Trans>
        </Button>
      </Box>
    </Box>
  )
}

const DescriptionEditor: FC<{
  onDismiss: () => void
  onSave: () => void
}> = ({ onDismiss, onSave }) => {
  const [value, setValue] = useState("")
  const [showPreview, setShowPreview] = useState(false)

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
          onClick={onSave}
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

export default PageCurriculumMaterial
