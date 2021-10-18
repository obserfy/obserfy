import Image from "next/image"
import { FC, useState } from "react"
import { isFilled } from "ts-is-present"
import { GetChildTimelineResponse } from "$api/children/[childId]/timeline"
import Icon from "$components/Icon/Icon"
import ImagePreview from "$components/ImagePreview/ImagePreview"
import Markdown from "$components/Markdown/Markdown"
import { ChildImage } from "$hooks/api/useGetChildImages"
import { useQueryString } from "$hooks/useQueryString"
import BaseLayout from "$layouts/BaseLayout"
import { withAuthorization } from "$lib/auth"
import { SSR } from "$lib/next"
import { findChildObservationsGroupedByDate } from "../../db/queries"
import dayjs from "$lib/dayjs"
import { generateOriginalUrl, generateUrl } from "../../utils/imgproxy"

const IndexPage: SSR<typeof getServerSideProps> = ({ timeline }) => {
  const studentId = useQueryString("studentId")
  const [imagePreview, setImagePreview] = useState<ChildImage>()

  return (
    <BaseLayout title="Timeline">
      {/* <div className="installed:hidden relative z-20 p-4 m-4 text-blue-800 bg-blue-100 rounded-xl text-sm"> */}
      {/*  Install as an App */}
      {/* </div> */}

      <div className="mx-auto max-w-3xl">
        <div className="pt-3 ml-8 border-l">
          {timeline?.map(({ date, observations }) => (
            <ObservationList
              key={date}
              date={date}
              observations={observations}
              setImagePreview={setImagePreview}
            />
          ))}

          <div className="flex items-center -ml-3 font-bold">
            <div className="mx-1 w-4 h-4 bg-white rounded-full border" />
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
  observations: GetChildTimelineResponse[0]["observations"]
  setImagePreview: Function
}> = ({ date, observations, setImagePreview }) => (
  <div className="mb-12">
    <div className="flex items-center mb-3 -ml-5 font-bold">
      <div className="flex justify-center items-center mx-1 w-8 h-8 bg-white rounded-full border">
        <Icon src="/icons/calendar.svg" />
      </div>
      <div className="ml-3 text-xs text-gray-700">
        {dayjs(date).format("dddd, D MMM YYYY")}
      </div>
    </div>

    {observations.map(({ id, shortDesc, longDesc, images, areaName }) => (
      <div className="flex mb-6 -ml-5" key={id}>
        <div className="flex flex-shrink-0 justify-center items-center mx-1 w-8 h-8 bg-white rounded-full border">
          <Icon src="/icons/edit.svg" />
        </div>
        <div className="pt-1">
          <div className="mx-3 mb-1 font-bold">{shortDesc}</div>
          <Markdown
            className="mx-3 mb-2 max-w-md text-gray-900"
            markdown={longDesc}
          />
          <div className="mx-3 mb-3 max-w-md text-green-900">{areaName}</div>
          <div className="flex flex-wrap ml-3">
            {images.map((img) => (
              <div className="mr-3 mb-3" key={img.id}>
                <button
                  className="cursor-pointer"
                  onClick={() => setImagePreview(img)}
                >
                  <Image
                    src={img.originalImageUrl}
                    height={60}
                    width={60}
                    className="object-cover rounded border"
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
  const data = await findChildObservationsGroupedByDate(
    params?.studentId as string
  )

  const timeline = data.map(({ date, observations }) => ({
    date: date.toISOString(),
    observations: observations.map(
      ({ id, long_desc, short_desc, images, area_name }) => ({
        id,
        shortDesc: short_desc,
        longDesc: long_desc ?? "",
        areaName: area_name ?? "",
        images: images.filter(isFilled).map(({ id: imageId, object_key }) => ({
          id: imageId,
          thumbnailUrl: generateUrl(object_key, 100, 100),
          originalImageUrl: generateOriginalUrl(object_key),
        })),
      })
    ),
  }))

  return {
    props: { timeline },
  }
})

export default IndexPage
