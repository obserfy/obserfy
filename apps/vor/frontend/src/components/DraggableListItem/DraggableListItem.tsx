import React, { TouchEvent, MouseEvent, FC, useRef, useState } from "react"
import { Flex, Box } from "theme-ui"

import Icon from "../Icon/Icon"
import { ReactComponent as GridIcon } from "../../icons/grid.svg"

interface Props {
  order: number
  moveItem: (order: number, offset: number, originalOrder: number) => void
  height: number
}
export const DraggableListItem: FC<Props> = ({
  children,
  moveItem,
  order,
  height,
}) => {
  const originalOrder = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const startingY = useRef(0)

  const onDragStart = (
    e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>,
    clientY: number
  ) => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    setDragOffset(clientY + scrollTop - 24)
    startingY.current = clientY
    setIsDragging(true)
    originalOrder.current = order
  }
  const onDragging = (
    e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>,
    clientY: number
  ) => {
    if (isDragging) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const offset = clientY - startingY.current
      setDragOffset(clientY + scrollTop - 24)
      moveItem(order, offset, originalOrder.current)
      e.preventDefault()
    }
  }
  const onDragStop = () => {
    setDragOffset(0)
    setIsDragging(false)
  }

  return (
    <Box
      sx={{ height: 48 }}
      backgroundColor="primaryLightest"
      onMouseMove={(e) => {
        // @ts-ignore
        onDragging(e, e.clientY)
      }}
      onTouchMove={(e) => onDragging(e, e.targetTouches[0].clientY)}
    >
      <Flex
        backgroundColor={isDragging ? "surface" : "background"}
        sx={{
          height,
          alignItems: "center",
          userSelect: "none",
          width: "100%",
          maxWidth: 640,
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          boxShadow: isDragging ? "low" : undefined,
          transition: "background-color .1s ease-in, box-shadow .1s ease-in",
          position: isDragging ? "absolute" : "relative",
          transform: `translateY(${dragOffset}px)`,
          zIndex: isDragging ? 10 : 1,
          top: 0,
        }}
      >
        <Box
          px={3}
          py={2}
          sx={{ cursor: "move" }}
          onMouseDown={(e) => {
            // @ts-ignore
            onDragStart(e, e.clientY)
          }}
          onMouseUp={onDragStop}
          onTouchEnd={onDragStop}
          onTouchStart={(e) => onDragStart(e, e.targetTouches[0].clientY)}
        >
          <Icon as={GridIcon} sx={{ width: 24 }} />
        </Box>
        {children}
      </Flex>
    </Box>
  )
}

export default DraggableListItem
