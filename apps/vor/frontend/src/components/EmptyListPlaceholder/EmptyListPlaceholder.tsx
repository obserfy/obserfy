import React, { FC } from "react"
import { Typography } from "../Typography/Typography"
import { Flex } from "../Flex/Flex"
import { Card, CardProps } from "../Card/Card"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

interface Props extends CardProps {
  text: string
  callToActionText: string
  onActionClick: () => void
}
export const EmptyListPlaceholder: FC<Props> = ({
  text,
  callToActionText,
  onActionClick,
  ...props
}) => (
  <Card {...props}>
    <Flex
      m={3}
      px={4}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography.Body mb={4} mt={3} textAlign="center">
        {text}
      </Typography.Body>
      <Button variant="outline" onClick={onActionClick}>
        <Icon as={PlusIcon} m={0} mr={2} />
        {callToActionText}
      </Button>
    </Flex>
  </Card>
)

export default EmptyListPlaceholder
