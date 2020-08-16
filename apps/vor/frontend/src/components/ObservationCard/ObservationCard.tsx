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
      pt={3}
    >
      {category && (
        <Typography.Body
          mx={3}
          mb={2}
          sx={{ fontSize: [1, 1], lineHeight: 1 }}
          color="textPrimary"
        >
          {category.name}
        </Typography.Body>
      )}
      <Typography.Body mx={3} data-cy="observation-short-desc">
        {observation.shortDesc}
      </Typography.Body>
      {observation.longDesc && (
        <Typography.Body
          mt={2}
          mb={1}
          mx={3}
          data-cy="observation-long-desc"
          lineHeight={1.8}
          color="textMediumEmphasis"
        >
          {observation.longDesc}
        </Typography.Body>
      )}
      <Flex sx={{ alignItems: "baseline" }} mb={2}>
        {observation.creatorName && (
          <Typography.Body
            sx={{ fontSize: [0, 0], lineHeight: 1 }}
            ml={3}
            color="textMediumEmphasis"
          >
            Created by {observation.creatorName.split(" ")[0]}{" "}
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
