import Icon from "$components/Icon/Icon"
import dayjs from "$lib/dayjs"
import Link from "next/link"
import { FC, useState } from "react"
import useGetAllLessonPlans from "../../hooks/api/useGetAllLessonPlans"
import { useQueryString } from "../../hooks/useQueryString"
import { GetChildPlansResponse } from "../../pages/api/children/[childId]/plans/all"
import { isEmpty } from "../../utils/array"

/** @deprecated unused page from old design */
const AllLessonPlans: FC = () => {
  const [search, setSearch] = useState("")
  const studentId = useQueryString("studentId")
  const studentLessonPlans = useGetAllLessonPlans(studentId)

  const plans = studentLessonPlans.data?.filter(({ title }) =>
    title.match(new RegExp(search, "i"))
  )

  return (
    <div className="mx-auto mb-5 w-full max-w-3xl border bg-surface md:rounded">
      <div className="focus-within:border-primary m-3 flex items-center rounded border bg-gray-100">
        <Icon src="/icons/search.svg" className="m-2 h-4 w-4 opacity-70" />
        <input
          className="mr-1 w-full bg-gray-100 py-2 outline-none"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isEmpty(plans) && studentLessonPlans.isSuccess && (
        <div className="p-3">No lesson plan found</div>
      )}

      {plans?.map((plan) => (
        <Plan key={plan.id} plan={plan} studentId={studentId} />
      ))}
    </div>
  )
}

const Plan: FC<{
  plan: GetChildPlansResponse
  studentId: string
}> = ({ plan, studentId }) => (
  <Link
    href={`/${studentId}/lesson-plan/details?planId=${plan.id}`}
    className="border-t p-3 hover:bg-gray-100"
  >
    <div className="flex-1 font-bold text-gray-700">{plan.title}</div>
    <div className="flex pt-2 text-xs">
      <div className="text-green-700">{plan.area?.name}</div>
      <div className="ml-auto opacity-70">
        {dayjs(plan.startDate).format("D MMM YYYY")}
      </div>
      {plan.repetitionType !== "0" && (
        <div className="ml-1 opacity-70">
          {" - "}
          {dayjs(plan.endDate).format("D MMM YYYY")}
        </div>
      )}
    </div>
  </Link>
)

export default AllLessonPlans
