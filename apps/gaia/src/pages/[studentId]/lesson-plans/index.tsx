import SlideOver from "$components/SlideOver"
import { useQueryString } from "$hooks/useQueryString"
import useSetQueries from "$hooks/useSetQueries"
import Image from "next/image"
import { ChangeEvent, FC, useState } from "react"
import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"
import LessonPlanDetailsSlideOver from "$components/LessonPlanDetailSlideOver"
import Select from "$components/Select"
import TextFieldWithIcon from "$components/TextFieldWithIcon"
import useTextQuery from "$hooks/useTextQuery"
import useToggle from "$hooks/useToggle"
import BaseLayout from "$layouts/BaseLayout"
import { withAuthorization } from "$lib/auth"
import dayjs, { Dayjs } from "$lib/dayjs"
import {
  findCurriculumAreasByStudentId,
  findOldestLessonPlanDateByStudentId,
  findStudentLessonPlans,
} from "$lib/db"
import { getQueryString, getStudentId, SSR } from "$lib/next"
import RecordsHeroImage from "$public/hero/records-hero.svg"

const today = dayjs()

const LessonPlansPage: SSR<typeof getServerSideProps> = ({
  lessonPlans,
  areas,
  oldestDate,
}) => {
  const query = useFilterQueries()

  const detailsSlideOver = useToggle()

  const [lessonPlanId, setLessonPlanId] = useState("")

  const handleLessonPlanClick = (id: string) => {
    setLessonPlanId(id)
    detailsSlideOver.toggle()
  }

  const isFiltered =
    !dayjs(query.to).isSame(today) ||
    !dayjs(query.from).isSame(dayjs(oldestDate)) ||
    query.search !== "" ||
    query.area !== "all"

  return (
    <BaseLayout title="Lesson Plans" className="max-w-7xl">
      <Header />
      <FilterBarMobile areas={areas} oldestDate={oldestDate} />

      <div className="mx-4 items-start lg:mt-4 lg:flex">
        <FilterCardDesktop oldestDate={oldestDate} areas={areas} />

        <div className="w-full overflow-hidden rounded-xl border bg-surface shadow-sm">
          <p className="border-b bg-gray-100 py-2 text-center font-semibold text-gray-600">
            Lesson Plans
          </p>

          {lessonPlans.length > 0 && (
            <ul>
              {lessonPlans.map(({ date, id, details }) => (
                <LessonPlan
                  key={id}
                  title={details.title ?? ""}
                  areaName={details.area?.name ?? ""}
                  repetitionType={details.repetitionType}
                  start={dayjs(date)}
                  end={
                    details.repetitionEndDate
                      ? dayjs(details.repetitionEndDate)
                      : undefined
                  }
                  onClick={() => handleLessonPlanClick(id)}
                />
              ))}
            </ul>
          )}

          {lessonPlans.length === 0 && (
            <div className="mt-8 mb-12 px-8 text-center">
              <Icon
                src="/icons/search.svg"
                className="mx-auto !h-10 !w-10"
                color="bg-gray-400"
              />
              <h3 className="mt-2 font-medium text-gray-900">
                No lesson plan found
              </h3>
              <p className="mt-1 text-gray-500">
                {isFiltered
                  ? `No lesson plan meets the given filter.`
                  : `No lesson plan have been added.`}
              </p>
            </div>
          )}
        </div>
      </div>

      <LessonPlanDetailsSlideOver
        show={detailsSlideOver.isOn}
        onClose={detailsSlideOver.toggle}
        lessonPlanId={lessonPlanId}
      />
    </BaseLayout>
  )
}

const LessonPlan: FC<{
  title: string
  areaName: string
  start: Dayjs
  repetitionType: string | null
  end?: Dayjs
  onClick?: () => void
}> = ({ start, areaName, end, repetitionType, title, onClick }) => {
  const isRepeating = repetitionType !== "0" && end && start.isBefore(end)
  return (
    <li className="border-t first:border-none">
      <button
        onClick={onClick}
        className="w-full p-4 text-left hover:bg-gray-50"
      >
        <div className={"flex"}>
          <h3 className="mb-1 flex-1 font-semibold text-gray-700">{title}</h3>
          <p className="ml-auto font-semibold text-primary-600">{areaName}</p>
        </div>
        <p className="mb-1 flex text-gray-500">
          {start.format("D MMM YYYY")}
          {isRepeating && (
            <span className="ml-1">{` - ${end?.format("D MMM YYYY")}`}</span>
          )}
        </p>
      </button>
    </li>
  )
}

const Header = () => (
  <div className="relative mx-4 mt-2 overflow-hidden rounded-2xl shadow-md sm:mt-4">
    <div className="absolute inset-0">
      <Image
        src={RecordsHeroImage}
        objectFit="cover"
        className="h-full w-full"
        layout="fill"
      />
    </div>

    <div className="relative bg-gradient-to-t from-[rgba(0,0,0,0.6)] p-4 pt-20 pb-8 lg:pt-24 lg:pb-12">
      <h1 className="mb-4 text-center text-3xl font-bold text-white lg:text-4xl">
        Lesson Plans
      </h1>
    </div>
  </div>
)

const FilterBarMobile: FC<{
  oldestDate: string
  areas: { id: string; name: string | null }[]
}> = ({ areas, oldestDate }) => {
  const filterSlideOver = useToggle()

  const query = useFilterQueries()
  const setQueries = useSetQueries()

  const [search, setSearch] = useTextQuery("search", "")
  const [area, setArea] = useState(query.area || "all")
  const [from, setFrom] = useState(dayjs(query.from || oldestDate))
  const [to, setTo] = useState(query.to ? dayjs(query.to) : today)

  const handleBulkChange = async (val: {
    search: string
    area: string
    from: Dayjs
    to: Dayjs
  }) => {
    if (!val.to.isSame(to)) {
      await setQueries({ to: val.to.format("YYYY-MM-DD") })
      setTo(val.to)
    }
    if (!val.from.isSame(from)) {
      await setQueries({ from: val.from.format("YYYY-MM-DD") })
      setFrom(val.from)
    }
    if (val.area !== area) {
      await setQueries({ area: val.area })
      setArea(val.area)
    }
    if (val.search !== search) {
      setSearch(val.search)
    }
  }

  const handleReset = async () => {
    await handleBulkChange({
      to: today,
      from: dayjs(oldestDate),
      search: "",
      area: "all",
    })
  }

  return (
    <div className="sticky top-0 z-10 mx-4 bg-gradient-to-b from-white via-white py-4 lg:hidden">
      <div className="flex">
        <TextFieldWithIcon
          label="Text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`"Reading ..."`}
          containerClassName="rounded-lg w-full"
          inputClassName="!rounded-xl"
          hideLabel
        />

        <Button
          variant="outline"
          className="ml-2 rounded-xl sm:text-sm"
          onClick={filterSlideOver.toggle}
        >
          <Icon src="/icons/filter.svg" className="mr-2" color="bg-gray-800" />
          Filters
        </Button>
      </div>

      <LessonPlanFilterSlideOver
        isOpen={filterSlideOver.isOn}
        oldestDate={oldestDate}
        areas={areas}
        onClose={filterSlideOver.toggle}
        onSet={async (values) => {
          await handleBulkChange({ ...values, search })
          filterSlideOver.toggle()
        }}
        onReset={async () => {
          await handleReset()
          filterSlideOver.toggle()
        }}
      />
    </div>
  )
}

const FilterCardDesktop: FC<{
  areas: Array<{ id: string; name: string | null }>
  oldestDate: string
}> = ({ areas, oldestDate }) => {
  const query = useFilterQueries()
  const setQueries = useSetQueries()

  const [search, setSearch] = useTextQuery("search", "")
  const [area, setArea] = useState(query.area || "all")
  const [from, setFrom] = useState(dayjs(query.from || oldestDate))
  const [to, setTo] = useState(query.to ? dayjs(query.to) : today)

  const handleFromChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = dayjs(e.target.value || oldestDate)
    await setQueries({ from: value.format("YYYY-MM-DD") })
    setFrom(value)
  }

  const handleToChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = dayjs(e.target.value || today)
    await setQueries({ to: value.format("YYYY-MM-DD") })
    setTo(value)
  }

  const handleAreaChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    await setQueries({ area: e.target.value })
    setArea(e.target.value)
  }

  return (
    <div className="sticky top-20 mr-4 mb-6 hidden w-full shrink-0 rounded-xl bg-gray-100 p-4 lg:block lg:w-1/3">
      <h2 className="mb-3 flex items-center justify-center font-semibold leading-none opacity-50">
        <Icon src="/icons/filter.svg" className="mr-1" color="bg-gray-800" />
        Filters
      </h2>

      <TextFieldWithIcon
        label="Text"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`"Reading ..."`}
        containerClassName="mb-2"
      />

      <Select
        defaultValue={area}
        value={area}
        onChange={handleAreaChange}
        label="Area"
        name="area"
      >
        <option value="all">All</option>
        {areas.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
        <option value="others">Others</option>
      </Select>

      <div className="isolate mt-4 -space-y-px rounded-md bg-white shadow-sm">
        <label
          htmlFor="date-from"
          className="relative block rounded-md rounded-b-none border py-2 px-3 focus-within:z-10 focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
        >
          <span className="block text-sm font-medium text-gray-700">From</span>
          <input
            type="date"
            name="date-from"
            id="date-from"
            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:ring-0"
            value={from.format("YYYY-MM-DD")}
            min={dayjs(oldestDate).format("YYYY-MM-DD")}
            max={to.format("YYYY-MM-DD")}
            onChange={handleFromChange}
          />
        </label>
        <label
          htmlFor="date-from"
          className="relative block rounded-md rounded-t-none border py-2 px-3 focus-within:z-10 focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
        >
          <span className="block w-full text-sm font-medium text-gray-700">
            To
          </span>
          <input
            type="date"
            name="date-to"
            id="date-to"
            className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:ring-0"
            value={to.format("YYYY-MM-DD")}
            min={from.format("YYYY-MM-DD")}
            max={today.format("YYYY-MM-DD")}
            onChange={handleToChange}
          />
        </label>
      </div>
    </div>
  )
}

const LessonPlanFilterSlideOver: FC<{
  isOpen: boolean
  oldestDate: string
  areas: Array<{ id: string; name: string | null }>
  onClose: () => void
  onSet: (value: { area: string; from: Dayjs; to: Dayjs }) => void
  onReset: () => void
}> = ({ onClose, isOpen, oldestDate, areas, onSet, onReset }) => {
  const query = useFilterQueries()

  const [area, setArea] = useState(query.area ?? "all")
  const [from, setFrom] = useState(dayjs(query.from || oldestDate))
  const [to, setTo] = useState(query.to ? dayjs(query.to) : today)

  return (
    <SlideOver
      show={isOpen}
      onClose={onClose}
      title="Filters"
      className="lg:hidden"
    >
      <div className="relative flex-1 border-t bg-gray-50 px-4 pt-3 sm:px-6">
        <Select
          defaultValue={area}
          value={area}
          onChange={(e) => setArea(e.target.value)}
          label="Area"
          name="area"
        >
          <option value="all">All</option>
          {areas.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
          <option value="others">Others</option>
        </Select>

        <div className="isolate mt-4 -space-y-px rounded-md bg-white shadow-sm">
          <label
            htmlFor="date-from"
            className="relative block rounded-md rounded-b-none border py-2 px-3 focus-within:z-10 focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
          >
            <span className="block text-sm font-medium text-gray-700">
              From
            </span>
            <input
              type="date"
              name="date-from"
              id="date-from"
              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:ring-0"
              value={from.format("YYYY-MM-DD")}
              min={dayjs(oldestDate).format("YYYY-MM-DD")}
              max={to.format("YYYY-MM-DD")}
              onChange={(e) => setFrom(dayjs(e.target.value || oldestDate))}
            />
          </label>
          <label
            htmlFor="date-from"
            className="relative block rounded-md rounded-t-none border py-2 px-3 focus-within:z-10 focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
          >
            <span className="block w-full text-sm font-medium text-gray-700">
              To
            </span>
            <input
              type="date"
              name="date-to"
              id="date-to"
              className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:ring-0"
              value={to.format("YYYY-MM-DD")}
              min={from.format("YYYY-MM-DD")}
              max={today.format("YYYY-MM-DD")}
              onChange={(e) => setTo(dayjs(e.target.value || today))}
            />
          </label>
        </div>
      </div>

      <div className="flex shrink-0 justify-end border-t p-4">
        <Button
          variant="outline"
          onClick={() => {
            setArea("all")
            setFrom(dayjs(oldestDate))
            setTo(today)
            onReset()
          }}
        >
          Reset
        </Button>
        <Button className="ml-4" onClick={() => onSet({ area, from, to })}>
          Set
        </Button>
      </div>
    </SlideOver>
  )
}

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const search = getQueryString(ctx, "search")
  const area = getQueryString(ctx, "area")
  const to = getQueryString(ctx, "to")
  const from = getQueryString(ctx, "from")

  const areas = await findCurriculumAreasByStudentId(studentId)
  const lessonPlans = await findStudentLessonPlans(studentId, {
    search,
    area: area === "all" ? undefined : area,
    to: to ? dayjs(to) : undefined,
    from: from ? dayjs(from) : undefined,
  })

  const oldestDate = await findOldestLessonPlanDateByStudentId(studentId)

  return {
    props: {
      oldestDate: oldestDate?.date?.toISOString() ?? dayjs().toISOString(),
      areas: areas ?? [],
      lessonPlans: lessonPlans.map(
        ({ date, id, lesson_plan_details: details }) => ({
          id,
          date: dayjs(date).format("YYYY-MM-DD"),
          details: {
            title: details?.title,
            description: details?.description,
            area: {
              name: details?.areas?.name || null,
            },
            repetitionType: details?.repetition_type?.toString() || null,
            repetitionEndDate:
              details?.repetition_end_date?.toISOString() || null,
          },
        })
      ),
    },
  }
})

const useFilterQueries = () => {
  return {
    area: useQueryString("area"),
    from: useQueryString("from"),
    to: useQueryString("to"),
    search: useQueryString("search"),
  }
}

export default LessonPlansPage
