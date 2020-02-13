import React, { ChangeEventHandler, FC, memo, useRef, useState } from "react"
import { motion, useDragControls, useMotionValue } from "framer-motion"
import nanoid from "nanoid"
import Dialog from "../Dialog/Dialog"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { ReactComponent as GridIcon } from "../../icons/grid.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { Material } from "../../api/useGetSubjectMaterials"
import { getAnalytics } from "../../analytics"
import { createSubjectApi } from "../../api/createSubjectApi"

const ITEM_HEIGHT = 48
interface Props {
  /** Called when cancel is clicked */
  onDismiss?: () => void
  /** Called when new subject is successfully saved */
  onSaved?: () => void
  areaId: string
}
export const NewSubjectDialog: FC<Props> = ({ onSaved, areaId, onDismiss }) => {
  const [loading, setLoading] = useState(false)
  const [subjectName, setSubjectName] = useState("")
  const [materials, setMaterials] = useState<Material[]>([])

  const isValid =
    materials.every(material => material.name !== "") && subjectName !== ""

  async function createSubject(): Promise<void> {
    setLoading(true)
    const response = await createSubjectApi(areaId, {
      name: subjectName,
      materials: materials.map(({ order, name }) => ({
        order,
        name,
      })),
    })

    if (response.status === 201) {
      getAnalytics()?.track("Subject Created", {
        responseStatus: response.status,
        studentName: subjectName,
      })
    }
    setLoading(false)
    if (onSaved) {
      onSaved()
    }
  }

  materials.sort((a, b) => a.order - b.order)
  const list = materials.map((material, i) => (
    <MaterialListItem
      key={material.id}
      material={material}
      autofocus={material.order === materials.length}
      onNameChange={e => {
        const newMaterial = [...materials]
        newMaterial[newMaterial.indexOf(material)].name = e.target.value
        setMaterials(newMaterial)
      }}
      onDelete={() => {
        const newMaterial = materials
          .filter(({ id }) => id !== material.id) // Remove material
          .map(current =>
            // Fix order number so none is skip
            current.order > material.order
              ? { ...current, order: current.order - 1 }
              : current
          )
        setMaterials(newMaterial)
      }}
      moveItem={(order, offset, originalOrder) => {
        // Calculate position inside the list while being dragged
        let position: number
        if (offset < 0) {
          position = Math.ceil((offset - ITEM_HEIGHT / 2) / ITEM_HEIGHT)
        } else {
          position = Math.floor((offset + ITEM_HEIGHT / 2) / ITEM_HEIGHT)
        }

        // Reorder list to reflect position after dragging
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
  ))

  const header = (
    <Flex
      alignItems="center"
      backgroundColor="surface"
      sx={{
        flexShrink: 0,
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
      <Button m={2} disabled={!isValid} onClick={createSubject}>
        {loading && <LoadingIndicator />}
        Save
      </Button>
    </Flex>
  )

  return (
    <Dialog>
      <Flex flexDirection="column" maxHeight="100%">
        {header}
        <Box backgroundColor="background" overflowY="auto" maxHeight="100%">
          <Box>
            <Box px={3} py={2}>
              <Input
                width="100%"
                label="Subject name"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
              />
            </Box>
            <Typography.Body
              px={3}
              fontSize={2}
              fontWeight="bold"
              color="textMediumEmphasis"
            >
              Materials
            </Typography.Body>
            <Box width="100%" overflow="hidden">
              {list}
            </Box>
            <Flex
              px={3}
              py={2}
              alignItems="center"
              backgroundColor="background"
              onClick={() => {
                setMaterials([
                  ...materials,
                  {
                    id: nanoid(),
                    name: "",
                    order: materials.length + 1,
                  },
                ])
              }}
              sx={{
                cursor: "pointer",
                position: "relative",
                userSelect: "none",
              }}
            >
              <Icon as={PlusIcon} m={0} mr={2} width={24} fill="primary" />
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

const MaterialListItem = memo<{
  material: Material
  moveItem: (order: number, offset: number, originalOrder: number) => void
  onDelete: () => void
  onNameChange: ChangeEventHandler<HTMLInputElement>
  autofocus: boolean
}>(({ material, moveItem, onDelete, onNameChange, autofocus }) => (
  <Draggable material={material} moveItem={moveItem}>
    <Input
      placeholder="Material name"
      p={0}
      width="100%"
      value={material.name}
      onChange={onNameChange}
      backgroundColor="transparent"
      autoFocus={autofocus}
      sx={{
        fontSize: [2, 1],
        p: 0,
        pl: 2,
        border: "none",
        height: "100%",
      }}
    />
    <Button mr={2} variant="secondary" onClick={onDelete}>
      <Icon as={DeleteIcon} m={0} />
    </Button>
  </Draggable>
))

const Draggable: FC<{
  material: Material
  moveItem: (order: number, offset: number, originalOrder: number) => void
}> = ({ moveItem, material, children }) => {
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
        willChange: "height, transform",
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
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          boxShadow: isDragging ? "low" : undefined,
          transition: "background-color .1s ease-in, box-shadow .1s ease-in",
        }}
      >
        <Box
          pl={3}
          py={2}
          sx={{ cursor: "move" }}
          onTouchEnd={() => {
            if (isDragging) setIsDragging(false)
          }}
          onMouseUp={() => {
            if (isDragging) setIsDragging(false)
          }}
          onTouchStart={e => {
            setIsDragging(true)
            dragControls.start(e)
          }}
          onMouseDown={e => {
            setIsDragging(true)
            dragControls.start(e)
          }}
        >
          <Icon as={GridIcon} m={0} mr={2} size={24} />
        </Box>
        {children}
      </Flex>
    </motion.li>
  )
}

export default NewSubjectDialog
