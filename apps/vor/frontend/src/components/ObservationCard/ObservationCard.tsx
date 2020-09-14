/** @jsx jsx */
import { FC } from "react"
import { jsx, Button, Card, Flex } from "theme-ui"
import Typography from "../Typography/Typography"
import { Observation } from "../../api/useGetStudentObservations"
import { Link } from "../Link/Link"
import { EDIT_OBSERVATION_URL } from "../../routes"

interface Props {
  observation: Observation
  onDelete: (value: Observation) => void
}
export const ObservationCard: FC<Props> = ({ onDelete, observation }) => (
  <Card mb={2} sx={{ borderRadius: [0, "default"] }} pt={2}>
    <Typography.Body mt={1} mx={3} data-cy="observation-short-desc">
      {observation.shortDesc}
    </Typography.Body>
    {observation.longDesc &&
      observation.longDesc.split("\n\n").map((text) => (
        <Typography.Body
          mt={2}
          mb={1}
          mx={3}
          data-cy="observation-long-desc"
          lineHeight={1.8}
          color="textMediumEmphasis"
        >
          {text}
        </Typography.Body>
      ))}
    <Flex sx={{ alignItems: "baseline" }} mb={2} ml={3}>
      {observation.area && (
        <Typography.Body
          mr={1}
          mb={2}
          sx={{ fontSize: [0, 0], lineHeight: 1 }}
          color="textPrimary"
        >
          {observation.area.name} {observation.creatorName && "|"}
        </Typography.Body>
      )}
      {observation.creatorName && (
        <Typography.Body
          sx={{ fontSize: 0, lineHeight: 1 }}
          color="textMediumEmphasis"
        >
          {observation.creatorName}
        </Typography.Body>
      )}
      <Button
        variant="secondary"
        color="danger"
        data-cy="delete-observation"
        onClick={() => onDelete(observation)}
        ml="auto"
        mr={2}
        px={2}
        sx={{ fontSize: 0 }}
      >
        Delete
      </Button>
      <Link
        to={EDIT_OBSERVATION_URL(observation.studentId, observation.id)}
        sx={{
          display: "inline-block",
          mr: 3,
          fontSize: 0,
          color: "text",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        Edit
      </Link>
    </Flex>
  </Card>
)

export default ObservationCard
