import { Timeline } from "$api/children/[childId]/timeline"
import Icon from "$components/Icon/Icon"
import ImagePreview from "$components/ImagePreview/ImagePreview"
import Markdown from "$components/Markdown/Markdown"
import { useQueryString } from "$hooks/useQueryString"
import BaseLayout from "$layouts/BaseLayout"
import { withAuthorization } from "$lib/auth"
import dayjs from "$lib/dayjs"
import { findStudentObservations } from "$lib/db"
import { convertMarkdownToHTML, SanitizedHTML } from "$lib/markdown"
import { SSR } from "$lib/next"
import { groupBy } from "fp-ts/NonEmptyArray"
import Image from "next/image"
import { FC, useState } from "react"
import { generateOriginalUrl, generateUrl } from "../../utils/imgproxy"

type Observations = Array<{
  id: string
  shortDesc: string | null
  longDesc: SanitizedHTML
  images: Array<{
    id: string | null
    originalImageUrl: string
  }>
  areaName: string
  eventTime: string | undefined
}>

const groupByDate = groupBy((observation: Observations[number]) => {
  return dayjs(observation.eventTime).format("YYYY-MM-DD")
})

const IndexPage: SSR<typeof getServerSideProps> = ({ observations }) => {
  const studentId = useQueryString("studentId")
  const [imagePreview, setImagePreview] =
    useState<Timeline["observations"][0]["images"][0]>()

  const timeline = groupByDate(observations)

  return (
    <BaseLayout title="Timeline">
      {/* <div className="installed:hidden relative z-20 p-4 m-4 text-blue-800 bg-blue-100 rounded-xl text-sm"> */}
      {/*  Install as an App */}
      {/* </div> */}

      <div className="mx-auto max-w-3xl">
        <div className="ml-8 border-l pt-3">
          {Object.keys(timeline)?.map((date) => {
            const observations = timeline[date] ?? []

            return (
              <ObservationList
                key={date}
                date={date}
                observations={observations}
                setImagePreview={setImagePreview}
              />
            )
          })}

          <div className="-ml-3 flex items-center font-bold">
            <div className="mx-1 h-4 w-4 rounded-full border bg-white" />
          </div>
        </div>

        {imagePreview && (
          <ImagePreview
            childId={studentId}
            img={imagePreview}
            onDismiss={() => setImagePreview(undefined)}
          />
        )}
      </div>
    </BaseLayout>
  )
}

const ObservationList: FC<{
  date: string
  setImagePreview: Function
  observations: Observations
}> = ({ date, observations, setImagePreview }) => (
  <div className="mb-12">
    <div className="-ml-5 mb-3 flex items-center font-bold">
      <div className="mx-1 flex h-8 w-8 items-center justify-center rounded-full border bg-white">
        <Icon src="/icons/calendar.svg" />
      </div>
      <div className="ml-3 text-xs text-gray-700">
        {dayjs(date).format("dddd, D MMM YYYY")}
      </div>
    </div>

    {observations.map(({ id, shortDesc, longDesc, images, areaName }) => (
      <div className="-ml-5 mb-6 flex" key={id}>
        <div className="mx-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white">
          <Icon src="/icons/edit.svg" />
        </div>
        <div className="pt-1">
          <div className="mx-3 mb-1 font-bold">{shortDesc}</div>
          <Markdown
            className="mx-3 mb-2 max-w-md text-gray-900"
            markdown={longDesc}
          />
          <div className="mx-3 mb-3 max-w-md text-green-900">{areaName}</div>
          <div className="ml-3 flex flex-wrap">
            {images.map((img) => (
              <div className="mb-3 mr-3" key={img.id}>
                <button
                  className="cursor-pointer"
                  onClick={() => setImagePreview(img)}
                >
                  <Image
                    src={img.originalImageUrl}
                    height={60}
                    width={60}
                    className="rounded border object-cover"
                    alt=""
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const getServerSideProps = withAuthorization(async ({ params }) => {
  const data = await findStudentObservations(params?.studentId as string)

  const observations = data.map(
    ({
      id,
      long_desc,
      short_desc,
      observation_to_images,
      areas,
      event_time,
    }) => ({
      id,
      shortDesc: short_desc,
      longDesc: convertMarkdownToHTML(long_desc ?? ""),
      areaName: areas?.name ?? "",
      images: observation_to_images.map(({ images: { object_key } }) => ({
        id: object_key,
        thumbnailUrl: generateUrl(object_key ?? "", 100, 100),
        originalImageUrl: generateOriginalUrl(object_key ?? ""),
      })),
      eventTime: event_time?.toISOString(),
    })
  )

  return {
    props: { observations },
  }
})

export default IndexPage
