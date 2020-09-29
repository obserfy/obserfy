/** @jsx jsx */
import { FC } from "react"
import { Card, Flex, jsx } from "theme-ui"
import Typography from "../Typography/Typography"
import { Observation } from "../../api/useGetStudentObservations"
import ImagePreview from "../ImagePreview/ImagePreview"
import { Link } from "../Link/Link"

interface Props {
  observation: Observation
  detailsUrl: string
}
export const ObservationCard: FC<Props> = ({ detailsUrl, observation }) => (
  <Card mb={2} sx={{ borderRadius: [0, "default"] }} pt={2}>
    <Typography.Body mt={1} mb={2} mx={3} data-cy="observation-short-desc">
      {observation.shortDesc}
    </Typography.Body>
    {observation.longDesc &&
      observation.longDesc.split("\n\n").map((text) => (
        <Typography.Body
          mb={2}
          mx={3}
          data-cy="observation-long-desc"
          lineHeight={1.8}
          color="textMediumEmphasis"
        >
          {text}
        </Typography.Body>
      ))}
    {observation.images.length > 0 && (
      <Flex sx={{ alignItems: "baseline", flexWrap: "wrap" }} mx={3}>
        {observation.images.map(({ id, originalUrl, thumbnailUrl }) => (
          <ImagePreview
            key={id}
            id={id}
            originalUrl={originalUrl}
            thumbnailUrl={thumbnailUrl}
            imageSx={{ mr: 2, mb: 2 }}
          />
        ))}
      </Flex>
    )}
    <Flex sx={{ alignItems: "baseline" }} ml={3} mr={2} mb={3}>
      {observation.area && (
        <Typography.Body
          mr={1}
          sx={{ fontSize: [0, 0], lineHeight: 1 }}
          color="textPrimary"
        >
          {observation.area.name} {observation.creatorName && "|"}
        </Typography.Body>
      )}
      {observation.creatorName && (
        <Typography.Body
          sx={{ fontSize: [0, 0], lineHeight: 1 }}
          color="textMediumEmphasis"
        >
          {observation.creatorName}
        </Typography.Body>
      )}
      <Link
        to={detailsUrl}
        sx={{ color: "textPrimary", ml: "auto", mr: 3, fontSize: 0 }}
      >
        See More
      </Link>
    </Flex>
  </Card>
)

export default ObservationCard
