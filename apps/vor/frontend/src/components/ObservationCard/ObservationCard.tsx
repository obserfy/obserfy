/** @jsx jsx */
import { FC } from "react"
import { Card, Flex, jsx } from "theme-ui"
import Typography from "../Typography/Typography"
import { Observation } from "../../api/useGetStudentObservations"

interface Props {
  observation: Observation
}
export const ObservationCard: FC<Props> = ({ observation }) => (
  <Card mb={2} sx={{ borderRadius: [0, "default"] }} pt={2}>
    <Typography.Body mt={1} mb={2} mx={3} data-cy="observation-short-desc">
      {observation.shortDesc}
    </Typography.Body>
    {observation.longDesc &&
      observation.longDesc.split("\n\n").map((text) => (
        <Typography.Body
          mb={3}
          mx={3}
          data-cy="observation-long-desc"
          lineHeight={1.8}
          color="textMediumEmphasis"
        >
          {text}
        </Typography.Body>
      ))}
    <Flex sx={{ alignItems: "baseline" }} mx={3} mb={2}>
      {observation.area && (
        <Typography.Body
          pb={2}
          mr={1}
          sx={{ fontSize: [0, 0], lineHeight: 1 }}
          color="textPrimary"
        >
          {observation.area.name} {observation.creatorName && "|"}
        </Typography.Body>
      )}
      {observation.creatorName && (
        <Typography.Body
          pb={2}
          sx={{ fontSize: 0, lineHeight: 1 }}
          color="textMediumEmphasis"
        >
          {observation.creatorName}
        </Typography.Body>
      )}
    </Flex>
  </Card>
)

export default ObservationCard
