import React, { FC, useRef, useState } from "react"
import { motion, useDragControls, useMotionValue } from "framer-motion"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
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
  const dragOriginY = useMotionValue(0)
  const dragControls = useDragControls()

  return (
    <motion.li
      drag="y"
      initial={false}
      dragListener={false}
      dragElastic={1}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragOriginY={dragOriginY}
      dragControls={dragControls}
      onDragEnd={() => setIsDragging(false)}
      onDragStart={() => {
        originalOrder.current = order
      }}
      animate={
        isDragging ? { zIndex: 1 } : { zIndex: 0, transition: { delay: 0.3 } }
      }
      positionTransition={({ delta }) => {
        if (isDragging) {
          dragOriginY.set(dragOriginY.get() + delta.y)
          return !isDragging
        }
        return {}
      }}
      style={{
        willChange: "height, transform",
        position: "relative",
        listStyle: "none",
        zIndex: isDragging ? 100 : 0,
      }}
      onDrag={(event, { velocity, offset: { y } }) => {
        if (velocity.y !== 0) {
          moveItem(order, y, originalOrder.current)
        }
      }}
    >
      <Flex
        alignItems="center"
        height={height}
        backgroundColor={isDragging ? "surface" : "background"}
        sx={{
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          boxShadow: isDragging ? "low" : undefined,
          transition: "background-color .1s ease-in, box-shadow .1s ease-in",
        }}
      >
        <Box
          px={3}
          py={2}
          sx={{ cursor: "move" }}
          onTouchEnd={() => {
            if (isDragging) setIsDragging(false)
          }}
          onMouseUp={() => {
            if (isDragging) setIsDragging(false)
          }}
          onTouchStart={(e) => {
            setIsDragging(true)
            dragControls.start(e)
          }}
          onMouseDown={(e) => {
            setIsDragging(true)
            dragControls.start(e)
          }}
        >
          <Icon as={GridIcon} m={0} size={24} />
        </Box>
        {children}
      </Flex>
    </motion.li>
  )
}

export default DraggableListItem
