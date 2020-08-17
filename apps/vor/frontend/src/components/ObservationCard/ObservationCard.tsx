import React, { FC } from "react"
import { Button, Card, Flex } from "theme-ui"
import Typography from "../Typography/Typography"

import { categories } from "../../categories"
import { Observation } from "../../api/useGetObservations"

interface Props {
  observation: Observation
  onDelete: (value: Observation) => void
  onEdit: (value: Observation) => void
}
export const ObservationCard: FC<Props> = ({
  onDelete,
  onEdit,
  observation,
}) => {
  const category = categories[parseInt(observation.categoryId, 10)]

  return (
    <Card
      mb={2}
      key={observation.id}
      sx={{ borderRadius: [0, "default"] }}
      pt={2}
    >
      <Typography.Body mt={1} mx={3} data-cy="observation-short-desc">
        {observation.shortDesc}
      </Typography.Body>
      {observation.longDesc &&
        observation.longDesc
          .split("\n")
          .filter((text) => text)
          .map((text) => (
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
      <Flex sx={{ alignItems: "baseline" }} mb={2}>
        {category && (
          <Typography.Body
            ml={3}
            mr={1}
            mb={2}
            sx={{ fontSize: [0, 0], lineHeight: 1 }}
            color="textPrimary"
          >
            {category.name}
          </Typography.Body>
        )}
        {observation.creatorName && (
          <Typography.Body
            sx={{ fontSize: [0, 0], lineHeight: 1 }}
            color="textMediumEmphasis"
          >
            by {observation.creatorName.split(" ")[0]}{" "}
          </Typography.Body>
        )}
        <Button
          variant="secondary"
          color="danger"
          data-cy="delete-observation"
          onClick={() => onDelete(observation)}
          ml="auto"
        >
          Delete
        </Button>
        <Button
          variant="secondary"
          data-cy="edit-observation"
          onClick={() => onEdit(observation)}
          mr={2}
        >
          Edit
        </Button>
      </Flex>
    </Card>
  )
}

export default ObservationCard
