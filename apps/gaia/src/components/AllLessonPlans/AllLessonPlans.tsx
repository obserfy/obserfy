import Link from "next/link"
import { FC, useState } from "react"
import useGetAllLessonPlans from "../../hooks/api/useGetAllLessonPlans"
import { useQueryString } from "../../hooks/useQueryString"
import SearchIcon from "../../icons/search.svg"
import { GetChildPlansResponse } from "../../pages/api/children/[childId]/plans/all"
import { isEmpty } from "../../utils/array"
import dayjs from "../../utils/dayjs"

const AllLessonPlans: FC = () => {
  const [search, setSearch] = useState("")
  const childId = useQueryString("childId")
  const childPlans = useGetAllLessonPlans(childId)

  const plans = childPlans.data?.filter(({ title }) =>
    title.match(new RegExp(search, "i"))
  )

  return (
    <div className="max-w-3xl mx-auto border w-full mb-5 md:rounded bg-surface">
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
        <Plan key={plan.id} plan={plan} childId={childId} />
      ))}
    </div>
  )
}

const Plan: FC<{ plan: GetChildPlansResponse; childId: string }> = ({
  plan,
  childId,
}) => (
  <Link href={`/lesson-plan/details?childId=${childId}&planId=${plan.id}`}>
    <div className="p-3 border-t hover:bg-gray-100">
      <div className="flex-1 font-bold text-gray-700">{plan.title}</div>
      <div className="flex text-xs pt-2">
        <div className="text-green-700">{plan.area?.name}</div>
        <div className="ml-auto opacity-70 ">
          {dayjs(plan.startDate).format("D MMM YYYY")}
        </div>
        {plan.repetitionType !== "0" && (
          <div className="ml-1 opacity-70 ">
            {" - "}
            {dayjs(plan.endDate).format("D MMM YYYY")}
          </div>
        )}
      </div>
    </div>
  </Link>
)

export default AllLessonPlans
