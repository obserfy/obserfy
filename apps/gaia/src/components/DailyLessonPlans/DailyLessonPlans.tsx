import { FC, useState } from "react"
import useGetDailyLessonPlans from "../../hooks/api/useGetDailyLessonPlans"
import { useQueryString } from "../../hooks/useQueryString"
import { isEmpty } from "../../utils/array"
import dayjs from "../../utils/dayjs"
import Button from "../Button/Button"
import EmptyPlaceholder from "../EmptyPlaceholder/EmptyPlaceholder"
import Icon from "../Icon/Icon"
import Plan from "./Plan"

const DailyLessonPlans: FC = () => {
  const [date, setDate] = useState(dayjs())
  const studentId = useQueryString("studentId")
  const childPlans = useGetDailyLessonPlans(studentId, date)

  const changeDate = (count: number) => () => setDate(date.add(count, "day"))

  return (
    <>
      <div className="flex items-center p-3 mx-auto max-w-3xl border-t">
        <div className="text-xs font-bold text-gray-700">
          {date.format("dddd, DD MMM YYYY")}
        </div>
        <Button className="ml-auto" variant="outline" onClick={changeDate(-1)}>
          <Icon src="/icons/chevron-left.svg" />
        </Button>
        <Button className="ml-1" variant="outline" onClick={changeDate(1)}>
          <Icon src="/icons/chevron-right.svg" />
        </Button>
        <Button
          className="ml-1 text-sm font-normal"
          variant="outline"
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

      <div className="mx-auto max-w-3xl">
        {childPlans.data?.map((plan) => (
          <Plan
            key={plan.id}
            childId={studentId}
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

export default DailyLessonPlans
