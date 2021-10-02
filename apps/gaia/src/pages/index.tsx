import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Head from "next/head"
import Image from "next/image"
import { FC, useState } from "react"
import Icon from "../components/Icon/Icon"
import ImagePreview from "../components/ImagePreview/ImagePreview"
import Markdown from "../components/Markdown/Markdown"
import { ChildImage } from "../hooks/api/useGetChildImages"
import useGetTimeline from "../hooks/api/useGetTimeline"
import { useQueryString } from "../hooks/useQueryString"
import dayjs from "../utils/dayjs"
import { GetChildTimelineResponse } from "./api/children/[childId]/timeline"

const IndexPage = () => {
  const childId = useQueryString("childId")
  const { data: timeline, isLoading, isSuccess } = useGetTimeline(childId)
  const [imagePreview, setImagePreview] = useState<ChildImage>()
  return (
    <div>
      <Head>
        <title>Obserfy for Parents</title>
      </Head>
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
        {isSuccess && (timeline?.length ?? 0) === 0 && (
          <EmptyTimelinePlaceholder loading={isLoading} />
        )}

        {imagePreview && (
          <ImagePreview
            childId={childId}
            img={imagePreview}
            onDismiss={() => setImagePreview(undefined)}
          />
        )}
      </div>
    </div>
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

const EmptyTimelinePlaceholder: FC<{ loading: boolean }> = ({ loading }) => (
  <div
    className={`flex flex-col items-center py-8 ${
      loading && "opacity-50"
    } transition-opacity duration-200 max-w-3xl mx-auto`}
  >
    <Image src="/undraw_Note_list_re_r4u9.svg" width={200} height={200} />
    <h5
      className={`text-xl mx-4 text-center mt-4 ${
        loading && "opacity-0"
      } transition-opacity duration-200 font-bold`}
    >
      Timeline is currently <br /> empty, check again later
    </h5>
  </div>
)

export default withPageAuthRequired(IndexPage)
