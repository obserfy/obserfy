import React, { FC, useState } from "react"
import Head from "next/head"
import Img from "react-optimized-image"
import { Svg } from "react-optimized-image/lib"
import dayjs, { Dayjs } from "../utils/dayjs"
import Button from "../components/Button/Button"
import ChevronRight from "../icons/chevron-right.svg"
import ChevronLeft from "../icons/chevron-left.svg"
import useGetChildPlans from "../hooks/api/useGetChildPlans"
import { useQueryString } from "../hooks/useQueryString"
import NoPlanIllustration from "../images/no-plan-illustration.svg"
import LinkIcon from "../icons/link.svg"

const IndexPage = () => {
  const [date, setDate] = useState(dayjs())
  const childId = useQueryString("childId")
  const childPlans = useGetChildPlans(childId, date)

  return (
    <div>
      <Head>
        <title>Home | Obserfy for Parents</title>
      </Head>
      <div className="flex items-end p-3">
        <div className="text-sm">{date.format("ddd, DD MMM 'YY")}</div>
        <Button
          className="px-1 ml-auto"
          outline
          onClick={() => setDate(date.add(-1, "day"))}
        >
          <Img src={ChevronLeft} />
        </Button>
        <Button
          className="px-1 ml-1"
          outline
          onClick={() => setDate(date.add(1, "day"))}
        >
          <Img alt="Next date" src={ChevronRight} />
        </Button>
        <Button
          className="ml-1 font-normal text-sm"
          outline
          onClick={() => setDate(dayjs())}
          disabled={date.isSame(dayjs(), "day")}
        >
          Today
        </Button>
      </div>
      {(childPlans.data?.length ?? 0) === 0 && (
        <NoPlansPlaceholder
          loading={childPlans.status === "loading"}
          date={date}
        />
      )}
      <div className="md:px-3">
        {childPlans.data?.map((plan) => (
          <Plan
            name={plan.title}
            files={[]}
            area={plan.area?.name}
            description={plan.description}
            links={plan.links}
          />
        ))}
      </div>
    </div>
  )
}

const Plan: FC<{
  name: string
  area: string
  description?: string
  files: Array<{
    link: string
    name: string
  }>
  links: Array<{
    id: string
    url: string
    title?: string
    description?: string
    image?: string
  }>
}> = ({ name, area, files, description, links }) => {
  return (
    <div className="flex flex-col items-start bg-surface md:rounded mb-2 border py-3">
      {area && <div className="text-sm text-green-700 px-3 mb-1">{area}</div>}
      <div className="text-md px-3">{name}</div>
      {description
        ?.split("\n")
        ?.filter((text) => text !== "")
        ?.map((text) => (
          <div className="text-gray-700 my-2 px-3">{text}</div>
        ))}
      {links.map((link) => {
        return (
          <a
            key={link.id}
            href={link.url}
            className="overflow-x-auto max-w-full px-3 underline py-2 flex items-center"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Svg
              src={LinkIcon}
              className="w-5 h-5 mr-2 fill-current flex-shrink-0"
            />
            <div className="whitespace-no-wrap">{link.url}</div>
          </a>
        )
      })}
      {files.length > 0 && (
        <div className="text-sm text-gray-700 mb-1">Files</div>
      )}
      <Button outline className="ml-auto mr-3 mt-3">
        Add observation
      </Button>
    </div>
  )
}

const NoPlansPlaceholder: FC<{ loading: boolean; date: Dayjs }> = ({
  loading,
  date,
}) => {
  return (
    <div
      className={`flex flex-col items-center py-16 ${
        loading && "opacity-50"
      } transition-opacity duration-200`}
    >
      <Img src={NoPlanIllustration} className="w-64 md:w-1/2 mb-3" />
      <h5
        className={`text-2xl mx-4 text-center ${
          loading && "opacity-0"
        } transition-opacity duration-200`}
      >
        No plans for {date.format("MMMM D")}
      </h5>
    </div>
  )
}

export default IndexPage
