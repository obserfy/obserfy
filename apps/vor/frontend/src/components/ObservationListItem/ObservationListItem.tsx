import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, Flex, ThemeUIStyleObject } from "theme-ui"
import { borderBottom } from "../../border"
import { Observation } from "../../hooks/api/useGetStudentObservations"
import { ReactComponent as EyeIcon } from "../../icons/eye.svg"
import Icon from "../Icon/Icon"
import ImagePreview from "../ImagePreview/ImagePreview"
import { Link } from "../Link/Link"
import Markdown from "../Markdown/Markdown"
import Typography from "../Typography/Typography"

export interface ObservationListItemProps {
  observation: Observation
  detailsUrl: string
  studentId: string
  containerSx?: ThemeUIStyleObject
}
const ObservationListItem: FC<ObservationListItemProps> = ({
  studentId,
  observation,
  detailsUrl,
  containerSx,
}) => {
  return (
    <Link to={detailsUrl}>
      <Box
        pt={3}
        sx={{
          ...borderBottom,
          ...containerSx,
          "&:hover": { backgroundColor: "primaryLighter" },
        }}
      >
        <Flex mb={2} mx={3}>
          <Typography.Body
            data-cy="observation-short-desc"
            sx={{ fontWeight: "bold", alignItems: "center" }}
          >
            {observation.shortDesc}
          </Typography.Body>
          {observation.visibleToGuardians && <Icon as={EyeIcon} ml="auto" />}
        </Flex>
        {observation.longDesc && (
          <Markdown
            mx={3}
            mb={3}
            data-cy="observation-long-desc"
            markdown={observation.longDesc}
          />
        )}

        <Flex ml={3}>
          {observation.area && (
            <Typography.Body
              mb={3}
              mr={1}
              sx={{ fontSize: 0, lineHeight: 1 }}
              color="textPrimary"
            >
              {observation.area.name} {observation.creatorName && "|"}
            </Typography.Body>
          )}
          {observation.creatorName && (
            <Typography.Body
              mb={3}
              sx={{ fontSize: 0, lineHeight: 1 }}
              color="textMediumEmphasis"
            >
              <Trans>By </Trans>
              {` ${observation.creatorName}`}
            </Typography.Body>
          )}
        </Flex>

        <Flex sx={{ alignItems: "baseline", flexWrap: "wrap" }} mx={3}>
          {observation.images.map(({ id, originalUrl, thumbnailUrl }) => (
            <ImagePreview
              studentId={studentId}
              imageId={id}
              key={id}
              id={id}
              originalUrl={originalUrl}
              thumbnailUrl={thumbnailUrl}
              imageSx={{ mr: 2, mb: 3 }}
            />
          ))}
        </Flex>
      </Box>
    </Link>
  )
}

export default ObservationListItem
