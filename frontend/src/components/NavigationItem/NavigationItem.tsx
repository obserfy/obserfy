import React, { FC, useState } from "react"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import Flex, { FlexProps } from "../Flex/Flex"
import { Link } from "gatsby-plugin-intl3"

interface Props extends FlexProps {
  text: string
  icon?: FC
  to: string
}

/** This component represents a navigation target. currently only used
 * on the sidebar. It uses Gatsby's link to render the ```<a></a>``` tag for creating
 * a link to other page on the app.
 * */
export const NavigationItem: FC<Props> = ({
  text,
  icon,
  to,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false)
  return (
    <Link
      to={to}
      getProps={({ isCurrent, isPartiallyCurrent }) => {
        setIsActive(to === "/" ? isCurrent : isPartiallyCurrent)
        return {} // for satisfying types request, no idea why tho....
      }}
    >
      <Flex
        alignItems="center"
        m={2}
        my={0}
        pl={2}
        backgroundColor={isActive ? "primaryLighter" : "none"}
        sx={{
          borderRadius: "default",
          textDecoration: "none",
          "&:hover": {
            backgroundColor: isActive ? "primaryLighter" : "primaryLightest"
          }
        }}
        {...props}
      >
        <Icon
          alt={`${text} icon`}
          ml={0}
          my={2}
          as={icon}
          sx={{ fill: isActive ? "primaryDark" : "icon" }}
        />
        <Typography.Body
          fontWeight={isActive ? "bold" : "normal"}
          color={isActive ? "primaryDark" : "text"}
          m={0}
        >
          {text}
        </Typography.Body>
      </Flex>
    </Link>
  )
}

export default NavigationItem
