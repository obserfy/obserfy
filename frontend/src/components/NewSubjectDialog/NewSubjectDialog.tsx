import React, { FC, useState } from "react"
import nanoid from "nanoid"
import { useImmer } from "use-immer"
import Dialog from "../Dialog/Dialog"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { Material } from "../../api/useGetSubjectMaterials"
import { getAnalytics } from "../../analytics"
import { createSubjectApi } from "../../api/createSubjectApi"
import DraggableMaterialListItem, {
  removeMaterial,
} from "../DraggableMaterialListItem/DraggableMaterialListItem"

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
  const [materials, setMaterials] = useImmer<Material[]>([])

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

  const list = materials.map((material, i) => (
    <DraggableMaterialListItem
      height={ITEM_HEIGHT}
      key={material.id}
      material={material}
      autofocus={material.order === materials.length}
      onNameChange={e => {
        const name = e.target.value
        setMaterials(draft => {
          draft[i].name = name
        })
      }}
      onDelete={() => setMaterials(removeMaterial(material.id, material.order))}
      moveItem={(order, offset, originalOrder) => {
        // Calculate position inside the list while being dragged
        let position: number
        if (offset < 0) {
          position = Math.ceil((offset - ITEM_HEIGHT / 2) / ITEM_HEIGHT)
        } else {
          position = Math.floor((offset + ITEM_HEIGHT / 2) / ITEM_HEIGHT)
        }

        // console.log(originalOrder + position)
        // Reorder list to reflect position after dragging
        if (originalOrder + position > order) {
          setMaterials(draft => {
            const nextItemIndex = Math.min(i + 1, materials.length - 1)
            draft[i].order += 1
            draft[nextItemIndex].order -= 1
            draft.sort((a, b) => a.order - b.order)
          })
        }
        if (originalOrder + position < order) {
          setMaterials(draft => {
            const previousItemIndex = Math.max(i - 1, 0)
            draft[i].order -= 1
            draft[previousItemIndex].order += 1
            draft.sort((a, b) => a.order - b.order)
          })
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
                setMaterials(draft => {
                  draft.push({
                    id: nanoid(),
                    name: "",
                    order: materials.length + 1,
                  })
                })
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

export default NewSubjectDialog
