import React, { FC, useState } from "react"
import { useImmer } from "use-immer"
import { nanoid } from "nanoid"
import { navigate } from "../Link/Link"
import { Material } from "../../api/useGetSubjectMaterials"
import { createSubjectApi } from "../../api/createSubjectApi"
import { getAnalytics } from "../../analytics"
import DraggableMaterialListItem from "../DraggableMaterialListItem/DraggableMaterialListItem"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Box from "../Box/Box"
import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import BackNavigation from "../BackNavigation/BackNavigation"
import { CURRICULUM_AREA_URL } from "../../routes"
import { useGetArea } from "../../api/useGetArea"

const ITEM_HEIGHT = 48

interface Props {
  areaId: string
}
export const PageNewSubject: FC<Props> = ({ areaId }) => {
  const [loading, setLoading] = useState(false)
  const [subjectName, setSubjectName] = useState("")
  const [materials, setMaterials] = useImmer<Material[]>([])
  const area = useGetArea(areaId)

  const isValid =
    materials.every((material) => material.name !== "") && subjectName !== ""

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
      navigate(CURRICULUM_AREA_URL(areaId))
    }
    setLoading(false)
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

  return (
    <Flex flexDirection="column" maxWidth="maxWidth.sm" margin="auto">
      <BackNavigation
        to={CURRICULUM_AREA_URL(areaId)}
        text={area.data?.name ?? ""}
      />
      <Typography.H6 m={3}>New Subject</Typography.H6>
      <Box backgroundColor="background">
        <Box>
          <Box p={3}>
            <Input
              width="100%"
              label="Subject name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
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
              setMaterials((draft) => {
                draft.push({
                  id: nanoid(),
                  name: "",
                  order: materials.length,
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
      <Flex justifyContent="flex-end" width="100%" p={3}>
        <Button disabled={!isValid} onClick={createSubject}>
          {loading && <LoadingIndicator />}
          Save
        </Button>
      </Flex>
    </Flex>
  )
}

export default PageNewSubject
