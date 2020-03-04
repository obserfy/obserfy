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
import DraggableMaterialListItem from "../DraggableMaterialListItem/DraggableMaterialListItem"

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

export default NewSubjectDialog
