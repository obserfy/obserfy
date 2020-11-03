import React, { FC } from "react"
import Head from "next/head"
import Img from "react-optimized-image"
import Image from "next/image"
import dayjs from "../utils/dayjs"
import useGetTimeline from "../hooks/api/useGetTimeline"
import { useQueryString } from "../hooks/useQueryString"
import { GetChildTimelineResponse } from "./api/children/[childId]/timeline"
import CalendarIcon from "../icons/calendar.svg"
import EditIcon from "../icons/edit.svg"
import EmptyTimeline from "../images/undraw_Preparation_re_t0ce.svg"

const IndexPage = () => {
  const childId = useQueryString("childId")
  const { data: timeline, isLoading } = useGetTimeline(childId)

  return (
    <div>
      <Head>
        <title>Obserfy for Parents</title>
      </Head>
      <div className="max-w-3xl mx-auto">
        <div className="border-l ml-8 pt-3">
          {timeline?.map(({ date, observations }) => (
            <DateItem key={date} date={date} observations={observations} />
          ))}

          <div className="flex items-center font-bold -ml-3">
            <div className="w-4 h-4  mx-1 bg-white rounded-full border " />
          </div>
        </div>
        {(timeline?.length ?? 0) === 0 && (
          <EmptyPlansIllustration loading={isLoading} />
        )}
      </div>
    </div>
  )
}

const DateItem: FC<{
  date: string
  observations: GetChildTimelineResponse[0]["observations"]
}> = ({ date, observations }) => (
  <div className="mb-12">
    <div className="flex items-center font-bold -ml-5 mb-3">
      <div className="w-8 h-8  mx-1 flex items-center justify-center bg-white rounded-full border ">
        <Img src={CalendarIcon} className="w-4 h-4" />
      </div>
      <div className="ml-3 text-xs text-gray-700">
        {dayjs(date).format("dddd, D MMM YYYY")}
      </div>
    </div>

    {observations.map(({ id, shortDesc, longDesc, images }) => (
      <div className="flex -ml-5 mb-6" key={id}>
        <div className="w-8 h-8 mx-1 flex items-center justify-center bg-white rounded-full border flex-shrink-0">
          <Img src={EditIcon} className="w-3 h-3" />
        </div>
        <div className="pt-1">
          <div className="mx-3 font-bold">{shortDesc}</div>
          <div className="mx-3 max-w-md text-gray-900 mb-2">{longDesc}</div>
          <div className="flex ml-3 flex-wrap">
            {images.map(({ originalImageUrl }) => (
              <div className="mr-3 mb-3">
                <Image
                  src={originalImageUrl}
                  height={60}
                  width={60}
                  className="rounded border object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
)

const EmptyPlansIllustration: FC<{ loading: boolean }> = ({ loading }) => (
  <div
    className={`flex flex-col items-center pt-16 ${
      loading && "opacity-50"
    } transition-opacity duration-200 max-w-3xl mx-auto`}
  >
    <Img src={EmptyTimeline} className="w-64 md:w-1/2 mb-4" />
    <h5
      className={`text-xl mx-4 text-center ${
        loading && "opacity-0"
      } transition-opacity duration-200 font-bold`}
    >
      Timeline is empty right now. <br />
      Check again later
    </h5>
  </div>
)

export default IndexPage
