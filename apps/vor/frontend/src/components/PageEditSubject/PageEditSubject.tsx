import React, { FC, useEffect, useState } from "react"
import { useImmer } from "use-immer"
import { nanoid } from "nanoid"
import { Flex, Box, Button } from "theme-ui"
import { navigate } from "../Link/Link"
import {
  Material,
  useGetSubjectMaterials,
} from "../../api/useGetSubjectMaterials"
import { useGetArea } from "../../api/useGetArea"
import { getAnalytics } from "../../analytics"
import { CURRICULUM_AREA_URL } from "../../routes"
import DraggableMaterialListItem from "../DraggableMaterialListItem/DraggableMaterialListItem"
import BackNavigation from "../BackNavigation/BackNavigation"
import Typography from "../Typography/Typography"

import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { useGetSubject } from "../../api/useGetSubject"
import { updateSubjectApi } from "../../api/updateSubjectApi"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

const ITEM_HEIGHT = 48

interface Props {
  areaId: string
  subjectId: string
}
export const PageEditSubject: FC<Props> = ({ areaId, subjectId }) => {
  const [submitting, setSubmitting] = useState(false)
  const [subjectName, setSubjectName] = useState("")
  const [materials, setMaterials] = useImmer<Material[]>([])

  const startingMaterials = useGetSubjectMaterials(subjectId, {
    refetchOnWindowFocus: false,
  })
  const area = useGetArea(areaId, {
    refetchOnWindowFocus: false,
  })
  const subject = useGetSubject(subjectId, {
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (startingMaterials.data && !startingMaterials.error) {
      setMaterials(() => startingMaterials.data ?? [])
    }
  }, [setMaterials, startingMaterials.data, startingMaterials.error])

  useEffect(() => {
    if (subject.data && !subject.error) {
      setSubjectName(subject.data?.name ?? "")
    }
  }, [setSubjectName, subject.data, subject.error])

  const isValid =
    materials.every((material) => material.name !== "") && subjectName !== ""

  async function updateSubject(): Promise<void> {
    setSubmitting(true)
    if (!subject.data) return
    const response = await updateSubjectApi({
      id: subject.data.id,
      order: subject.data.order,
      name: subjectName,
      materials,
      areaId,
    })

    if (response.status === 200) {
      getAnalytics()?.track("Subject Created", {
        responseStatus: response.status,
        studentName: subjectName,
      })
      navigate(CURRICULUM_AREA_URL(areaId))
    }
    setSubmitting(false)
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

  if (area.status === "loading" && subject.status === "loading") {
    return (
      <Box py={3} px={3} sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
        <LoadingPlaceholder sx={{ width: "20rem", height: "3rem" }} mb={4} />
        <LoadingPlaceholder sx={{ width: "20rem", height: "3rem" }} mb={4} />
        <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "8rem", height: "2rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} mb={2} />
        <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} mb={2} />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
      <BackNavigation
        to={CURRICULUM_AREA_URL(areaId)}
        text={area.data?.name ?? ""}
      />
      <Typography.H6 m={3}>Edit Subject</Typography.H6>
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
          fontSize: 1,
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
          backgroundColor: "background",
          alignItems: "center",
          cursor: "pointer",
          position: "relative",
          userSelect: "none",
        }}
      >
        <Icon as={PlusIcon} m={0} mr={2} width={24} fill="primary" />
        <Typography.Body
          color="textMediumEmphasis"
          sx={{
            fontSize: 1,
          }}
        >
          Add material
        </Typography.Body>
      </Flex>
      <Flex sx={{ width: "100%", justifyContent: "flex-end" }} p={3}>
        <Button disabled={!isValid} onClick={updateSubject}>
          {submitting && <LoadingIndicator />}
          Save
        </Button>
      </Flex>
    </Box>
  )
}

export default PageEditSubject
