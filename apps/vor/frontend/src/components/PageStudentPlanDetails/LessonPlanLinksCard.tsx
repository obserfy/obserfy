import { Button, Card, Flex } from "theme-ui"
import { Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Typography } from "../Typography/Typography"
import { GetPlanResponseBody } from "../../api/plans/useGetPlan"
import useDeleteLessonPlanLink from "../../api/plans/useDeleteLessonPlanLink"
import Icon from "../Icon/Icon"
import { ReactComponent as LinkIcon } from "../../icons/link.svg"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import usePostNewLessonPlanLink from "../../api/plans/usePostNewLessonPlanLink"
import LinkInput from "../LinkInput/LinkInput"

const LessonPlanLinksCard: FC<{
  planId: string
  links: Array<{
    id: string
    url: string
    title?: string
    description?: string
    image?: string
  }>
}> = ({ links, planId }) => (
  <Card sx={{ borderRadius: [0, "default"] }} mb={3}>
    <Typography.Body
      mt={3}
      mx={3}
      mb={1}
      color="textMediumEmphasis"
      sx={{ lineHeight: 1, fontSize: 1 }}
    >
      <Trans>Links</Trans>
    </Typography.Body>
    {links && links.length === 0 && (
      <Typography.Body m={3}>
        <Trans>No links attached yet</Trans>
      </Typography.Body>
    )}
    {links.map((link) => (
      <LessonPlanLink key={link.id} link={link} lessonPlanId={planId} />
    ))}
    <UrlField lessonPlanId={planId} />
  </Card>
)

const LessonPlanLink: FC<{
  link: GetPlanResponseBody["links"][0]
  lessonPlanId: string
}> = ({ link, lessonPlanId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [deleteLink] = useDeleteLessonPlanLink(link.id, lessonPlanId)

  return (
    <Flex my={3} mr={3} sx={{ alignItems: "center", maxHeight: "100%" }}>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          overflowX: ["auto", "hidden"],
        }}
      >
        <Icon as={LinkIcon} ml={3} />
        <Typography.Body
          mx={2}
          sx={{
            whiteSpace: "nowrap",
            display: "inline-block",
            textDecoration: "underline",
          }}
        >
          {link.url}
        </Typography.Body>
      </a>
      <Button
        variant="outline"
        ml="auto"
        color="danger"
        px={2}
        backgroundColor="surface"
        sx={{ zIndex: 2, flexShrink: 0 }}
        onClick={async () => {
          setIsLoading(true)
          const result = await deleteLink()
          if (!result?.ok) {
            setIsLoading(false)
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingIndicator ml={1} />
        ) : (
          <Icon as={TrashIcon} fill="danger" />
        )}
      </Button>
    </Flex>
  )
}

const UrlField: FC<{ lessonPlanId: string }> = ({ lessonPlanId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [postNewLink] = usePostNewLessonPlanLink(lessonPlanId)
  const [url, setUrl] = useState("")

  async function sendPostNewLinkRequest() {
    setIsLoading(true)
    const result = await postNewLink({ url })
    if (result?.ok) {
      setUrl("")
    }
    setIsLoading(false)
  }

  return (
    <LinkInput
      value={url}
      onChange={setUrl}
      isLoading={isLoading}
      onSave={sendPostNewLinkRequest}
      containerSx={{ mx: 3, mb: 3, mt: 2 }}
      inputSx={{ backgroundColor: "background" }}
    />
  )
}

export default LessonPlanLinksCard
