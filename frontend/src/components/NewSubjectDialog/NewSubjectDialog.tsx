import React, { FC, MouseEventHandler, useRef, useState } from "react"
import { motion, useDragControls, useMotionValue } from "framer-motion"
import Dialog from "../Dialog/Dialog"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { ReactComponent as GridIcon } from "../../icons/grid.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { Material } from "../../api/useGetSubjectMaterials"

interface Props {
  /** Called when cancel is clicked */
  onDismiss?: () => void
  /** Called when new subject is successfully saved */
  onSaved?: () => void
}
export const NewSubjectDialog: FC<Props> = ({ onDismiss }) => {
  const [loading] = useState(false)

  return (
    <Dialog>
      <Flex flexDirection="column" maxHeight="100%">
        <Flex
          alignItems="center"
          backgroundColor="surface"
          sx={{
            position: "relative",
            borderBottomColor: "border",
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
          }}
        >
          <Typography.H6
            width="100%"
            sx={{
              position: "absolute",
              pointerEvents: "none",
              textAlign: "center",
              alignContent: "center",
            }}
          >
            New Subject
          </Typography.H6>
          <Button variant="outline" color="danger" m={2} onClick={onDismiss}>
            Cancel
          </Button>
          <Spacer />
          <Button m={2}>
            {loading && <LoadingIndicator />}
            Save
          </Button>
        </Flex>
        <Box backgroundColor="background" overflowY="auto">
          <Box>
            <Box px={3} py={2}>
              <Input width="100%" label="Subject name" />
            </Box>
            <Typography.Body
              px={3}
              fontSize={2}
              fontWeight="bold"
              color="textMediumEmphasis"
            >
              Materials
            </Typography.Body>
            <MaterialList />
            <Flex px={3} py={2} alignItems="center">
              <Icon
                as={PlusIcon}
                m={0}
                mr={2}
                width={24}
                fill="primary"
                sx={{ cursor: "pointer" }}
              />
              <Typography.Body color="textMediumEmphasis" fontSize={1}>
                Add material
              </Typography.Body>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Dialog>
  )
}

const ITEM_HEIGHT = 48
const MaterialList: FC = () => {
  const [materials, setMaterials] = useState<Material[]>([
    { id: "b", name: "Michigan", order: 2 },
    { id: "c", name: "Test", order: 3 },
    { id: "a", name: "Detroit", order: 1 },
    { id: "e", name: "Silly", order: 5 },
    { id: "d", name: "Strotum", order: 4 },
  ])

  materials.sort((a, b) => a.order - b.order)
  const list = materials.map((material, i) => {
    return (
      <MaterialListItem
        key={material.id}
        material={material}
        moveItem={(order, offset, originalOrder) => {
          let position = 0
          if (offset < 0) {
            position = Math.ceil((offset - ITEM_HEIGHT / 2) / ITEM_HEIGHT)
          } else {
            position = Math.floor((offset + ITEM_HEIGHT / 2) / ITEM_HEIGHT)
          }
          if (originalOrder + position > order) {
            const newMaterial = materials.slice(0)
            const nextItemIndex = Math.min(i + 1, materials.length - 1)
            newMaterial[i].order += 1
            newMaterial[nextItemIndex].order -= 1
            setMaterials(newMaterial)
          }
          if (originalOrder + position < order) {
            const newMaterial = materials.slice(0)
            const previousItemIndex = Math.max(i - 1, 0)
            newMaterial[i].order -= 1
            newMaterial[previousItemIndex].order += 1
            setMaterials(newMaterial)
          }
        }}
      />
    )
  })

  return <Box width="100%">{list}</Box>
}

const MaterialListItem: FC<{
  material: Material
  moveItem: (order: number, offset: number, originalOrder: number) => void
}> = ({ moveItem, material }) => {
  const originalOrder = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragControls = useDragControls()
  const dragOriginY = useMotionValue(0)

  const startDrag: MouseEventHandler = event => {
    dragControls.start(event, { snapToCursor: true })
  }

  return (
    <motion.li
      drag="y"
      dragElastic={1}
      initial={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragOriginY={dragOriginY}
      dragControls={dragControls}
      onDragEnd={() => setIsDragging(false)}
      onDragStart={() => {
        setIsDragging(true)
        originalOrder.current = material.order
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
        position: "relative",
        listStyle: "none",
        zIndex: isDragging ? 100 : 0,
      }}
      onDrag={(event, { velocity, offset: { y } }) => {
        if (velocity.y !== 0) {
          moveItem(material.order, y, originalOrder.current)
        }
      }}
    >
      <Flex
        alignItems="center"
        height={ITEM_HEIGHT}
        backgroundColor={isDragging ? "surface" : "background"}
        sx={{
          userSelect: "none",
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          boxShadow: isDragging ? "low" : undefined,
          transition: "background-color .1s ease-in, box-shadow .1s ease-in",
        }}
      >
        <Box pl={3} py={2} onMouseDown={startDrag}>
          <Icon as={GridIcon} m={0} mr={2} size={24} sx={{ cursor: "move" }} />
        </Box>
        <Typography.Body fontSize={1}>{material.name}</Typography.Body>
      </Flex>
    </motion.li>
  )
}

export default NewSubjectDialog
