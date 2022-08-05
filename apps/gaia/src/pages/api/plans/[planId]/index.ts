import { findLessonPlanById } from "$lib/db"
import { convertMarkdownToHTML, SanitizedHTML } from "$lib/markdown"
import { guardians, observations as Observations, users } from "@prisma/client"
import { isPresent } from "ts-is-present"
import { protectedApiRoute } from "../../../../utils/rest"

export interface GetLessonPlanResponse {
  id: string
  title?: string | null
  areaName: string
  description: string
  descriptionHTML: SanitizedHTML
  endDate?: string
  links: Array<{ id?: string | null; url?: string | null }>
  repetitionType?: string
  startDate: string
  observations: (Observations & {
    guardians: guardians | null
    users: users | null
    long_desc_html: SanitizedHTML
  })[]
}

const handleLessonPlan = protectedApiRoute(async (req, res) => {
  const { planId } = req.query

  if (req.method === "GET") {
    const lp = await findLessonPlanById(planId as string)

    if (lp) {
      const { lesson_plan_details: details } = lp
      const response: GetLessonPlanResponse = {
        id: lp.id,
        title: details?.title,
        description: details?.description ?? "",
        descriptionHTML: convertMarkdownToHTML(details?.description),
        links: details?.lesson_plan_links?.filter(isPresent) ?? [],
        areaName: details?.areas?.name ?? "",
        endDate: details?.repetition_end_date?.toISOString(),
        startDate: lp.date.toISOString(),
        repetitionType: details?.repetition_type?.toString(),
        observations: lp.observations.map((o) => {
          return {
            ...o,
            long_desc_html: convertMarkdownToHTML(o.long_desc),
          }
        }),
      }
      return res.json(response)
    }
    return res.status(404).end()
  }
  return res.status(405).end()
})

export default handleLessonPlan
