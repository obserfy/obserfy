import React, { FC } from "react"

import { SxStyleProp } from "rebass"
import { Typography } from "../Typography/Typography"
import Flex, { FlexProps } from "../Flex/Flex"
import { Box } from "../Box/Box"

interface Props extends FlexProps {
  values: string[]
  selectedItemIdx: number
  onItemClick?: (index: number) => void
  itemFlexProp?: Array<number | string>
}
export const ToggleButton: FC<Props> = ({
  values,
  selectedItemIdx,
  onItemClick,
  itemFlexProp,
  ...props
}) => (
  <Flex backgroundColor="surface" sx={{ borderRadius: "default" }} {...props}>
    {values.map((value, index) => {
      const isSelected = selectedItemIdx === index
      const styleProps: SxStyleProp = {
        // Base style
        cursor: "pointer",
        backgroundColor: isSelected ? "primaryLighter" : "surface",
        borderStyle: "solid",
        borderRadius: 0,
        borderWidth: 1,
        borderColor: isSelected ? "primaryLight" : "border",
        borderLeftStyle: isSelected ? "primaryLight" : "none",
        flex: itemFlexProp || ["inherit"],
        transition: "background-color 100ms cubic-bezier(0.0, 0.0, 0.2, 1)",
      }
      if (index === 0) {
        // First item
        styleProps.borderTopLeftRadius = "default"
        styleProps.borderBottomLeftRadius = "default"
        styleProps.borderLeftStyle = "solid"
      } else if (index === values.length - 1) {
        // Last item
        styleProps.borderTopRightRadius = "default"
        styleProps.borderBottomRightRadius = "default"
      }
      return (
        <Box
          onClick={() => {
            if (onItemClick !== undefined) onItemClick(index)
          }}
          key={value}
          px={3}
          sx={styleProps}
        >
          <Typography.Body
            m={0}
            color={isSelected ? "primaryDark" : "text"}
            fontSize={1}
            sx={{
              transition: "color 100ms cubic-bezier(0.0, 0.0, 0.2, 1)",
              userSelect: "none",
              textAlign: "center",
            }}
          >
            {value}
          </Typography.Body>
        </Box>
      )
    })}
  </Flex>
)

export default ToggleButton
