import React, { FC } from "react"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Pill from "../Pill/Pill"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import Card from "../Card/Card"
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
    <Card mb={2} key={observation.id} borderRadius={[0, "default"]}>
      <Typography.H6
        mx={3}
        mt={observation.longDesc ? 3 : 2}
        mb={0}
        data-cy="observation-short-desc"
      >
        {observation.shortDesc}
      </Typography.H6>
      {observation.longDesc && (
        <Typography.Body
          fontSize={1}
          mt={2}
          mx={3}
          mb={3}
          data-cy="observation-long-desc"
        >
          {observation.longDesc}
        </Typography.Body>
      )}
      <Flex
        p={2}
        pb={0}
        alignItems="center"
        sx={{
          borderTopWidth: 1,
          borderTopStyle: observation.longDesc ? "solid" : "none",
          borderTopColor: "border",
        }}
      >
        <Flex flexWrap="wrap">
          <Pill
            ml={2}
            mb={2}
            backgroundColor={category.color}
            text={category.name}
            color={category.onColor}
          />
          {observation.creatorName && (
            <Pill
              ml={2}
              mb={2}
              text={observation.creatorName.split(" ")[0]}
              color="text"
            />
          )}
        </Flex>
        <Spacer />
        <Button
          variant="secondary"
          color="danger"
          data-cy="delete-observation"
          onClick={() => onDelete(observation)}
          fontSize={0}
          mb={2}
        >
          delete
        </Button>
        <Button
          variant="secondary"
          data-cy="edit-observation"
          fontSize={0}
          onClick={() => onEdit(observation)}
          mb={2}
        >
          Edit
        </Button>
      </Flex>
    </Card>
  )
}

export default ObservationCard
