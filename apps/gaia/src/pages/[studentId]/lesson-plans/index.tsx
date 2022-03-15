import Image from "next/image"
import { FC, useState } from "react"
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

const LessonPlansPage: SSR<typeof getServerSideProps> = ({
  lessonPlans,
  areas,
  oldestDate,
}) => {
  const detailsSlideOver = useToggle()
  const [lessonPlanId, setLessonPlanId] = useState("")

  const handleLessonPlanClick = (id: string) => {
    setLessonPlanId(id)
    detailsSlideOver.toggle()
  }

  return (
    <BaseLayout title="Lesson Plans" className="max-w-7xl">
      <Header />
      <FilterBarMobile />

      <div className="lg:flex items-start mx-4 lg:mt-4">
        <FilterCardDesktop areas={areas} />

        <div className="overflow-hidden w-full bg-surface rounded-xl border shadow-sm">
          <p className="py-2 font-semibold text-center text-gray-600 bg-gray-100 border-b">
            Lesson Plans
          </p>

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
        className="p-4 w-full text-left hover:bg-gray-50"
      >
        <h3 className="flex-1 mb-1 font-semibold text-gray-700">{title}</h3>
        <p className="flex mb-1 text-gray-500">
          {start.format("D MMM YYYY")}
          {isRepeating && (
            <span className="ml-1">{` - ${end?.format("D MMM YYYY")}`}</span>
          )}
        </p>
        <p className="font-semibold text-primary-600">{areaName}</p>
      </button>
    </li>
  )
}

const Header = () => (
  <div className="overflow-hidden relative mx-4 mt-2 sm:mt-4 rounded-2xl shadow-md">
    <div className="absolute inset-0">
      <Image
        src={RecordsHeroImage}
        objectFit="cover"
        className="w-full h-full"
        layout="fill"
      />
    </div>

    <div className="relative p-4 pt-20 lg:pt-24 pb-8 lg:pb-12 bg-gradient-to-t from-[rgba(0,0,0,0.6)]">
      <h1 className="mb-4 text-3xl lg:text-4xl font-bold text-center text-white">
        Lesson Plans
      </h1>
    </div>
  </div>
)

const FilterBarMobile: FC = () => {
  const filterSlideOver = useToggle()
  const [search, setSearch] = useTextQuery("search", "")

  return (
    <div className="lg:hidden sticky top-0 z-10 py-4 mx-4 bg-gradient-to-b from-white via-white">
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
          className="ml-2 sm:text-sm rounded-xl"
          onClick={filterSlideOver.toggle}
        >
          <Icon src="/icons/filter.svg" className="mr-2" color="bg-gray-800" />
          Filters
        </Button>
      </div>
    </div>
  )
}

const FilterCardDesktop: FC<{
  areas: Array<{ id: string; name: string | null }>
}> = ({ areas }) => {
  const [search, setSearch] = useTextQuery("search", "")

  return (
    <div className="hidden lg:block sticky top-20 flex-shrink-0 p-4 mr-4 mb-6 w-full lg:w-1/3 bg-gray-100 rounded-xl">
      <h2 className="flex justify-center items-center mb-3 font-semibold leading-none opacity-50">
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
        // defaultValue={area}
        // value={area}
        // onChange={handleAreaChange}
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

      <div className="isolate mt-4 -space-y-px bg-white rounded-md shadow-sm">
        <label
          htmlFor="date-from"
          className="block relative focus-within:z-10 py-2 px-3 rounded-md rounded-b-none border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
        >
          <span className="block text-sm font-medium text-gray-700">From</span>
          <input
            type="date"
            name="date-from"
            id="date-from"
            className="block p-0 w-full placeholder-gray-500 text-gray-900 border-0 focus:ring-0"
            // value={from.format("YYYY-MM-DD")}
            // min={dayjs(oldestDate).format("YYYY-MM-DD")}
            // max={to.format("YYYY-MM-DD")}
            // onChange={handleFromChange}
          />
        </label>
        <label
          htmlFor="date-from"
          className="block relative focus-within:z-10 py-2 px-3 rounded-md rounded-t-none border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
        >
          <span className="block w-full text-sm font-medium text-gray-700">
            To
          </span>
          <input
            type="date"
            name="date-to"
            id="date-to"
            className="p-0 w-full placeholder-gray-500 text-gray-900 border-0 focus:ring-0"
            // value={to.format("YYYY-MM-DD")}
            // min={from.format("YYYY-MM-DD")}
            // max={today.format("YYYY-MM-DD")}
            // onChange={handleToChange}
          />
        </label>
      </div>
    </div>
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
    area,
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

export default LessonPlansPage
