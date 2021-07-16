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
  const childId = useQueryString("childId")
  const [date, setDate] = useState(dayjs())
  const childPlans = useGetDailyLessonPlans(childId, date)

  const changeDate = (count: number) => () => setDate(date.add(count, "day"))

  return (
    <>
      <div className="max-w-3xl mx-auto flex items-center p-3 border-t">
        <div className="text-xs font-bold text-gray-700">
          {date.format("dddd, DD MMM YYYY")}
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

export default DailyLessonPlans
