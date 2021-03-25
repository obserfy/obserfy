import React, { FC } from "react"
import { Flex } from "theme-ui"
import { ReactComponent as ChatIcon } from "../../icons/message-circle.svg"
import Icon from "../Icon/Icon"

export interface ChatwootProps {}
const Chatwoot: FC<ChatwootProps> = () => {
  return (
    <Flex
      py={3}
      sx={{ width: "100$", alignItems: "center", flexDirection: "column" }}
    >
      <Icon
        as={ChatIcon}
        size={24}
        fill="transparent"
        color="textMediumEmphasis"
      />
    </Flex>
  )
}

export default Chatwoot
