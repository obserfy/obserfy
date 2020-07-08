import React, { FC, useState } from "react"
import Head from "next/head"
import Img from "react-optimized-image"
import dayjs, { Dayjs } from "../utils/dayjs"
import Button from "../components/button"
import ChevronRight from "../icons/chevron-right.svg"
import ChevronLeft from "../icons/chevron-left.svg"
import useGetChildPlans from "../hooks/useGetChildPlans"
import { useQueryString } from "../hooks/useQueryString"
import Plan from "../components/plan"
import NoPlanIllustration from "../images/no-plan-illustration.svg"

const IndexPage = () => {
  const [date, setDate] = useState(dayjs())
  const childId = useQueryString("childId")
  const childPlans = useGetChildPlans(childId, date)

  return (
    <div className="p-3">
      <Head>
        <title>Home | Obserfy for Parents</title>
      </Head>
      <div className="flex items-center mb-3">
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
      {childPlans.data?.map((plan) => (
        <Plan name={plan.name} files={[]} area="Practical Life" />
      ))}
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
