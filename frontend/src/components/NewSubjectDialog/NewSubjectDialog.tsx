import React, { FC, useRef, useState } from "react"
import { animated, interpolate, UseSpringProps, useSprings } from "react-spring"
import { useDrag } from "react-use-gesture"
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
interface SpringProps {
  y: number
  zIndex: number
}

const calculateItemStyle = (
  materials: Material[],
  selectedId = "",
  delta = 0
) => (index: number): UseSpringProps<SpringProps> => {
  if (materials[index].id !== selectedId) {
    return { y: index * ITEM_HEIGHT, immediate: false, zIndex: 1 }
  }
  return {
    y: index * ITEM_HEIGHT + delta,
    immediate: true,
    zIndex: 10,
  }
}

const MaterialList: FC = () => {
  const materials = useRef<Material[]>([
    { id: "a", name: "Detroit", order: 1 },
    { id: "b", name: "Michigan", order: 2 },
    { id: "c", name: "Test", order: 3 },
    { id: "d", name: "Strotum", order: 4 },
    { id: "e", name: "Silly", order: 5 },
  ])

  const [springs, setSprings] = useSprings<SpringProps>(
    materials.current.length,
    calculateItemStyle(materials.current)
  )

  const bind = useDrag(({ args: [material], down, movement: [, y] }) => {
    if (!down) {
      setSprings(calculateItemStyle(materials.current, "", y) as any)
    } else {
      setSprings(calculateItemStyle(materials.current, material.id, y) as any)
    }
  })

  const list = springs.map(({ zIndex, y }, i) => {
    const material = materials.current[i]
    return (
      <animated.div
        {...bind(materials.current[i])}
        key={material.id}
        style={{
          zIndex,
          touchAction: "none",
          position: "absolute",
          width: "100%",
          transform: interpolate([y], ys => `translateY(${ys}px)`),
        }}
      >
        <MaterialListItem material={material} />
      </animated.div>
    )
  })

  return (
    <Box
      height={materials.current.length * ITEM_HEIGHT}
      width="100%"
      sx={{ position: "relative" }}
    >
      {list}
    </Box>
  )
}

const MaterialListItem: FC<{ material: Material }> = ({ material }) => (
  <Flex
    alignItems="center"
    px={3}
    py={2}
    height={ITEM_HEIGHT}
    backgroundColor="background"
    sx={{
      userSelect: "none",
      borderBottomColor: "border",
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
    }}
  >
    <Icon as={GridIcon} m={0} mr={2} size={24} sx={{ cursor: "move" }} />
    <Typography.Body fontSize={1}>{material.name}</Typography.Body>
  </Flex>
)

export default NewSubjectDialog
