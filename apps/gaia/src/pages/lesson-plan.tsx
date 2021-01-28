import Head from "next/head"
import React, { FC, useState } from "react"
import Button from "../components/Button/Button"
import EmptyPlaceholder from "../components/EmptyPlaceholder/EmptyPlaceholder"
import Icon from "../components/Icon/Icon"
import Plan from "../components/Plan/Plan"
import useGetChildPlans from "../hooks/api/useGetChildPlans"
import useGetChildPlansByDate from "../hooks/api/useGetChildPlansByDate"
import { useQueryString } from "../hooks/useQueryString"
import { isEmpty } from "../utils/array"
import dayjs from "../utils/dayjs"
import CalendarIcon from "../icons/calendar.svg"
import ListIcon from "../icons/list.svg"
import SearchIcon from "../icons/search.svg"

enum ViewMode {
  ByDates,
  Overview,
}

const IndexPage = () => {
  const [viewMode, setViewMode] = useState(ViewMode.Overview)

  return (
    <div>
      <Head>
        <title>Lesson Plans | Obserfy for Parents</title>
      </Head>

      <div className="w-full border-b flex ">
        <div className="w-full max-w-3xl mx-auto flex px-1">
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
      {viewMode === ViewMode.Overview && <LessonPlanOverview />}
    </div>
  )
}

const LessonPlansByDate: FC = () => {
  const childId = useQueryString("childId")
  const [date, setDate] = useState(dayjs())
  const childPlans = useGetChildPlansByDate(childId, date)

  const changeDate = (count: number) => () => setDate(date.add(count, "day"))

  return (
    <>
      <div className="max-w-3xl mx-auto flex items-center px-3 pt-3 pb-1">
        <div className="text-xs font-bold text-gray-700">
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

const LessonPlanOverview: FC = () => {
  const [search, setSearch] = useState("")
  const childId = useQueryString("childId")
  const childPlans = useGetChildPlans(childId)

  const plans = childPlans.data?.filter(({ title }) =>
    title.match(new RegExp(search, "i"))
  )

  return (
    <div className="max-w-3xl mx-auto border w-full m-3 md:rounded bg-surface">
      <div className="flex items-center border rounded focus-within:border-primary bg-gray-100 m-3">
        <SearchIcon className="w-4 h-4 m-2 opacity-70" />
        <input
          className="w-full py-2 outline-none mr-1 bg-gray-100"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isEmpty(plans) && childPlans.isSuccess && (
        <div className="p-3">No lesson plan found</div>
      )}

      {plans?.map((plan) => (
        <div key={plan.id} className="p-3 border-t hover:bg-gray-100">
          <div className="flex-1 font-bold text-gray-700">{plan.title}</div>
          <div className="flex text-xs opacity-70 pt-1">
            <div className="flex-1 ">{plan.area?.name}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default IndexPage
