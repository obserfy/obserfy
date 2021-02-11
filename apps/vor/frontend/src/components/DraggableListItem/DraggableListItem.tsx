import React, { TouchEvent, MouseEvent, FC, useRef, useState } from "react"
import { Flex, Box, ThemeUIStyleObject } from "theme-ui"
import Icon from "../Icon/Icon"
import { ReactComponent as GridIcon } from "../../icons/grid_round.svg"

interface Props {
  order: number
  moveItem: (order: number, offset: number, originalOrder: number) => void
  height: number
  sx?: ThemeUIStyleObject
}
export const DraggableListItem: FC<Props> = ({
  children,
  moveItem,
  order,
  height,
  sx,
}) => {
  const originalOrder = useRef(0)
  const [isGrabbed, setIsGrabbed] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const startingY = useRef(0)

  const handleDrag = (
    e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>,
    clientY: number
  ) => {
    if (isGrabbed) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const offset = clientY - startingY.current
      setDragOffset(clientY + scrollTop - 24)
      moveItem(order, offset, originalOrder.current)
      e.preventDefault()
    }
  }

  const handleMouseDown = (
    e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>,
    clientY: number
  ) => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    setDragOffset(clientY + scrollTop - 24)
    startingY.current = clientY
    setIsGrabbed(true)
    originalOrder.current = order
  }

  const handleMouseUp = () => {
    setDragOffset(0)
    setIsGrabbed(false)
  }

  return (
    <Box
      sx={{ height, ...sx }}
      onMouseMove={(e) => handleDrag(e, e.clientY)}
      onTouchMove={(e) => handleDrag(e, e.targetTouches[0].clientY)}
    >
      <Flex
        backgroundColor={isGrabbed ? "surface" : "transparent"}
        sx={{
          height,
          alignItems: "center",
          userSelect: "none",
          width: "100%",
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          boxShadow: isGrabbed ? "low" : undefined,
          transition: "background-color .1s ease-in, box-shadow .1s ease-in",
          position: isGrabbed ? "absolute" : "relative",
          transform: `translateY(${dragOffset}px)`,
          zIndex: isGrabbed ? 10 : 1,
          top: 0,
        }}
      >
        <Box
          px={3}
          py={2}
          sx={{ cursor: "move" }}
          onClick={(e) => e.preventDefault()}
          onMouseDown={(e) => handleMouseDown(e, e.clientY)}
          onMouseUp={handleMouseUp}
          onTouchStart={(e) => handleMouseDown(e, e.targetTouches[0].clientY)}
          onTouchEnd={handleMouseUp}
        >
          <Icon as={GridIcon} sx={{ width: 24 }} />
        </Box>
        {children}
      </Flex>
    </Box>
  )
}

export default DraggableListItem
