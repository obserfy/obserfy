import React, { FC, useState } from "react"
import nanoid from "nanoid"
import { produce } from "immer"
import { useImmer } from "use-immer"
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
  const [materials, setMaterials] = useImmer<Material[]>(
    produce(subject.materials, draft => {
      draft.sort((a, b) => a.order - b.order)
    })
  )

  const isValid =
    materials.every(({ name }) => name !== "") && subjectName !== ""

  async function updateSubject(): Promise<void> {
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

  const list = materials.map((material, i) => (
    <DraggableMaterialListItem
      key={material.id}
      height={ITEM_HEIGHT}
      material={material}
      setMaterials={setMaterials}
      autofocus={material.order === materials.length}
      length={materials.length}
      i={i}
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
        Edit Subject
      </Typography.H6>
      <Button variant="outline" color="danger" m={2} onClick={onDismiss}>
        Cancel
      </Button>
      <Spacer />
      <Button m={2} disabled={!isValid} onClick={updateSubject}>
        {loading && <LoadingIndicator />}
        Save
      </Button>
    </Flex>
  )

  return (
    <Dialog>
      <Flex flexDirection="column" maxHeight="100vh">
        {header}
        <Box backgroundColor="background" overflowY="auto" maxHeight="100%">
          <Box pb={100}>
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

export default EditSubjectDialog
