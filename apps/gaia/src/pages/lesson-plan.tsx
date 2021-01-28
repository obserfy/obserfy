import Head from "next/head"
import React, { useState } from "react"
import Button from "../components/Button/Button"
import EmptyPlaceholder from "../components/EmptyPlaceholder/EmptyPlaceholder"
import Icon from "../components/Icon/Icon"
import Plan from "../components/Plan/Plan"
import useGetChildPlans from "../hooks/api/useGetChildPlans"
import { useQueryString } from "../hooks/useQueryString"
import { isEmpty } from "../utils/array"
import dayjs from "../utils/dayjs"
import CalendarIcon from "../icons/calendar.svg"
import ListIcon from "../icons/list.svg"

enum ViewMode {
  ByDates,
  Overview,
}

const IndexPage = () => {
  const [viewMode, setViewMode] = useState(ViewMode.ByDates)

  return (
    <div>
      <Head>
        <title>Lesson Plans | Obserfy for Parents</title>
      </Head>

      <div className="w-full border-b flex ">
        <div className="w-full max-w-3xl mx-auto flex px-3">
          <button
            onClick={() => setViewMode(ViewMode.ByDates)}
            className="ml-auto m-1 hover:text-green-700"
          >
            <CalendarIcon
              className={`
              w-4 h-4 m-2
              ${viewMode === ViewMode.ByDates ? "text-green-700" : "opacity-80"}
            `}
            />
          </button>
          <button
            onClick={() => setViewMode(ViewMode.Overview)}
            className="m-1 hover:text-green-700"
          >
            <ListIcon
              className={`
              w-4 h-4 m-2
              ${
                viewMode === ViewMode.Overview ? "text-green-700" : "opacity-80"
              }
            `}
            />
          </button>
        </div>
      </div>

      {viewMode === ViewMode.ByDates && <LessonPlansByDate />}
    </div>
  )
}

const LessonPlansByDate = () => {
  const childId = useQueryString("childId")
  const [date, setDate] = useState(dayjs())
  const childPlans = useGetChildPlans(childId, date)

  const changeDate = (count: number) => () => setDate(date.add(count, "day"))

  return (
    <>
      <div className="max-w-3xl mx-auto flex items-center px-3 pt-3 pb-1">
        <div className="text-sm text-gray-700">
          {date.format("ddd, DD MMM YYYY")}
        </div>
        <Button className="ml-auto" outline iconOnly onClick={changeDate(-1)}>
          <Icon src="/icons/chevron-left.svg" size={16} />
        </Button>
        <Button className="ml-1" outline iconOnly onClick={changeDate(1)}>
          <Icon alt="Next date" src="/icons/chevron-right.svg" size={16} />
        </Button>
        <Button
          className="ml-1 font-normal text-sm"
          outline
          small
          onClick={() => setDate(dayjs())}
          disabled={date.isSame(dayjs(), "day")}
        >
          Today
        </Button>
      </div>

      {isEmpty(childPlans.data) && (
        <EmptyPlaceholder
          imageSrc="/images/no-plan-illustration.svg"
          text={`No plans for ${date.format("MMMM D")}`}
          loading={childPlans.isLoading}
          date={date}
        />
      )}

      <div className="max-w-3xl mx-auto">
        {childPlans.data?.map((plan) => (
          <Plan
            key={plan.id}
            childId={childId}
            planId={plan.id}
            name={plan.title}
            area={plan.area?.name ?? ""}
            description={plan.description}
            links={plan.links}
            observations={plan.observations}
            files={[]}
          />
        ))}
      </div>
    </>
  )
}

export default IndexPage
