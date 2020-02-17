import React, { FC, useState } from "react"
import nanoid from "nanoid"
import { Material } from "../../api/useGetSubjectMaterials"
import { getAnalytics } from "../../analytics"
import DraggableMaterialListItem from "../DraggableMaterialListItem/DraggableMaterialListItem"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Dialog from "../Dialog/Dialog"
import Box from "../Box/Box"
import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { Subject } from "../../api/useGetAreaSubjects"
import { updateSubjectApi } from "../../api/updateSubjectApi"

const ITEM_HEIGHT = 48

interface Props {
  onDismiss?: () => void
  onSaved?: () => void
  subject: Subject & { materials: Material[] }
  areaId: string
}
export const EditSubjectDialog: FC<Props> = ({
  onSaved,
  onDismiss,
  subject,
  areaId,
}) => {
  const [loading, setLoading] = useState(false)
  const [subjectName, setSubjectName] = useState(subject.name)
  const [materials, setMaterials] = useState<Material[]>(subject.materials)

  const isValid =
    materials.every(material => material.name !== "") && subjectName !== ""

  async function createSubject(): Promise<void> {
    setLoading(true)
    const response = await updateSubjectApi({
      ...subject,
      name: subjectName,
      materials,
      areaId,
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
    <DraggableMaterialListItem
      height={ITEM_HEIGHT}
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

export default EditSubjectDialog
