import React, { FC, useState } from "react"
import { useImmer } from "use-immer"
import { nanoid } from "nanoid"
import { Box, Button, Flex } from "theme-ui"
import { navigate } from "../Link/Link"
import { Material } from "../../api/useGetSubjectMaterials"
import { createSubjectApi } from "../../api/createSubjectApi"
import DraggableMaterialListItem from "../DraggableMaterialListItem/DraggableMaterialListItem"
import Typography from "../Typography/Typography"

import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_AREA_URL,
} from "../../routes"
import { useGetArea } from "../../api/useGetArea"
import TopBar from "../TopBar/TopBar"

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
      analytics.track("Subject Created", {
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
    <Flex
      sx={{
        flexDirection: "column",
        maxWidth: "maxWidth.sm",
      }}
      margin="auto"
    >
      <TopBar
        breadcrumbs={[
          {
            text: "Admin",
            to: ADMIN_URL,
          },
          {
            text: "Curriculum",
            to: ADMIN_CURRICULUM_URL,
          },
          { text: `${area.data?.name} Area`, to: CURRICULUM_AREA_URL(areaId) },
          { text: "New Subject" },
        ]}
      />
      <Typography.H6 m={3}>New Subject</Typography.H6>
      <Box
        sx={{
          backgroundColor: "background",
        }}
      >
        <Box>
          <Box p={3}>
            <Input
              sx={{ width: "100%" }}
              label="Subject name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </Box>
          <Typography.Body
            px={3}
            sx={{
              fontSize: 2,
              fontWeight: "bold",
            }}
            color="textMediumEmphasis"
          >
            Materials
          </Typography.Body>
          <Box sx={{ width: "100%", overflow: "hidden" }}>{list}</Box>
          <Flex
            px={3}
            py={2}
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
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
              userSelect: "none",
              backgroundColor: "background",
            }}
          >
            <Icon as={PlusIcon} mr={2} width={24} fill="primary" />
            <Typography.Body
              color="textMediumEmphasis"
              sx={{
                fontSize: 1,
              }}
            >
              Add material
            </Typography.Body>
          </Flex>
        </Box>
      </Box>
      <Flex sx={{ justifyContent: "flex-end", width: "100%" }} p={3}>
        <Button disabled={!isValid} onClick={createSubject}>
          {loading && <LoadingIndicator />}
          Save
        </Button>
      </Flex>
    </Flex>
  )
}

export default PageNewSubject
