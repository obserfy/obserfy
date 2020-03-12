import React, { FC, useEffect, useState } from "react"
import { useImmer } from "use-immer"
import { navigate } from "gatsby-plugin-intl3"
import nanoid from "nanoid"
import {
  Material,
  useGetSubjectMaterials,
} from "../../api/useGetSubjectMaterials"
import { useGetArea } from "../../api/useGetArea"
import { getAnalytics } from "../../analytics"
import { CURRICULUM_AREA_URL } from "../../pages/dashboard/settings/curriculum/area"
import DraggableMaterialListItem from "../DraggableMaterialListItem/DraggableMaterialListItem"
import Flex from "../Flex/Flex"
import BackNavigation from "../BackNavigation/BackNavigation"
import Typography from "../Typography/Typography"
import Box from "../Box/Box"
import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Button from "../Button/Button"
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
  const startingMaterials = useGetSubjectMaterials(subjectId)
  const [submitting, setSubmitting] = useState(false)
  const [subjectName, setSubjectName] = useState("")
  const [materials, setMaterials] = useImmer<Material[]>([])
  const area = useGetArea(areaId)
  const subject = useGetSubject(subjectId)

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
    materials.every(material => material.name !== "") && subjectName !== ""

  async function updateSubject(): Promise<void> {
    setSubmitting(true)
    if (subject.data === null) return
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

  if (area.isFetching && subject.isFetching) {
    return (
      <Box py={3} px={3} maxWidth="maxWidth.sm" margin="auto">
        <LoadingPlaceholder width="20rem" height="3rem" mb={4} />
        <LoadingPlaceholder width="20rem" height="3rem" mb={4} />
        <LoadingPlaceholder width="100%" height="6rem" mb={3} />
        <LoadingPlaceholder width="8rem" height="2rem" mb={2} />
        <LoadingPlaceholder width="100%" height="4rem" mb={2} />
        <LoadingPlaceholder width="100%" height="4rem" mb={2} />
        <LoadingPlaceholder width="100%" height="4rem" mb={2} />
        <LoadingPlaceholder width="100%" height="4rem" mb={2} />
      </Box>
    )
  }

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      <BackNavigation
        to={CURRICULUM_AREA_URL(areaId)}
        text={area.data?.name ?? ""}
      />
      <Typography.H6 m={3}>Edit Subject</Typography.H6>
      <Box p={3}>
        <Input
          width="100%"
          label="Subject name"
          value={subjectName}
          onChange={e => setSubjectName(e.target.value)}
        />
      </Box>
      <Typography.Body px={3} fontSize={1} color="textMediumEmphasis">
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
      <Flex justifyContent="flex-end" width="100%" p={3}>
        <Button disabled={!isValid} onClick={updateSubject}>
          {submitting && <LoadingIndicator />}
          Save
        </Button>
      </Flex>
    </Box>
  )
}

export default PageEditSubject
