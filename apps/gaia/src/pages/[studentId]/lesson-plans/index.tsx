import Image from "next/image"
import { FC, useState } from "react"
import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"
import TextFieldWithIcon from "$components/TextFieldWithIcon"
import BaseLayout from "$layouts/BaseLayout"
import { withAuthorization } from "$lib/auth"
import dayjs from "$lib/dayjs"
import { findStudentLessonPlans } from "$lib/db"
import { getQueryString, getStudentId, SSR } from "$lib/next"
import RecordsHeroImage from "$public/hero/records-hero.svg"

const IndexPage: SSR<typeof getServerSideProps> = ({ lessonPlans }) => (
  <BaseLayout title="Lesson Plans" className="max-w-7xl">
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

    <MobileFilter />

    <div className="mx-4 lg:mt-4 bg-surface rounded-xl border shadow-sm">
      <p className="py-2 font-semibold text-center text-gray-600 bg-gray-100 border-b">
        Lesson Plans
      </p>

      <ul>
        {lessonPlans.map(({ date, id, lesson_plan_details }) => {
          const startDate = dayjs(date)
          const endDate = lesson_plan_details?.repetition_end_date
            ? dayjs(lesson_plan_details?.repetition_end_date)
            : null

          const haveEndDate =
            lesson_plan_details?.repetition_type?.toString() !== "0" &&
            endDate &&
            startDate.isBefore(endDate)

          return (
            <li
              key={id}
              className="block p-4 hover:bg-gray-100 border-t first:border-none"
            >
              <p className="flex-1 font-bold text-gray-700">
                {lesson_plan_details?.title}
              </p>
              <p className="font-bold text-primary-600">
                {lesson_plan_details?.areas?.name}
              </p>
              <p className="flex text-gray-500">
                {startDate.format("D MMM YYYY")}
                {haveEndDate && (
                  <span className="ml-1">
                    {` - ${endDate?.format("D MMM YYYY")}`}
                  </span>
                )}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  </BaseLayout>
)

const MobileFilter: FC = () => {
  const [search, setSearch] = useState("")

  return (
    <div className="lg:hidden sticky top-0 z-10 py-4 mx-4 bg-gradient-to-b from-white via-white">
      <div className="flex">
        <TextFieldWithIcon
          label="Text"
          name="search"
          value={search}
          // onChange={handleSearchChange}
          placeholder={`"Reading ..."`}
          containerClassName="rounded-lg w-full"
          inputClassName="!rounded-xl"
          hideLabel
        />

        <Button
          variant="outline"
          className="ml-2 sm:text-sm rounded-xl"
          // onClick={filterSlideOver.toggle}
        >
          <Icon src="/icons/filter.svg" className="mr-2" color="bg-gray-800" />
          Filters
        </Button>
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

  const lessonPlans = await findStudentLessonPlans(studentId)
  return {
    props: {
      lessonPlans,
    },
  }
})

export default IndexPage
