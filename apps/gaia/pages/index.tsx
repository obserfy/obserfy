import React, { useState } from "react"
import dayjs from "../utils/dayjs"
import Button from "../components/button"
import ChevronRight from "../icons/chevron-right.svg"
import ChevronLeft from "../icons/chevron-left.svg"
import useGetChildPlans from "../hooks/useGetChildPlans"
import { useQueryString } from "../hooks/useQueryString"
import DisappointedIllustration from "../images/disappointed-illustration.png"
import Plan from "../components/plan"

const IndexPage = () => {
  const [date, setDate] = useState(dayjs())
  const childId = useQueryString("childId")
  const childPlans = useGetChildPlans(childId, date)

  return (
    <div className="p-3">
      <div className="flex items-center mb-3">
        <div className="text-sm">{date.format("ddd, DD MMM 'YY")}</div>
        <Button
          className="px-1 ml-auto"
          outline
          onClick={() => setDate(date.add(-1, "day"))}
        >
          <img alt="Previous date" src={ChevronLeft} />
        </Button>
        <Button
          className="px-1 ml-1"
          outline
          onClick={() => setDate(date.add(1, "day"))}
        >
          <img alt="Next date" src={ChevronRight} />
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
      {childPlans.status === "success" && childPlans.data?.length === 0 && (
        <div className="flex flex-col items-center py-16 ">
          <img
            alt="No plans yet illustration"
            src={DisappointedIllustration}
            width={300}
            className="mb-4"
          />
          <h5 className="text-2xl mx-4 text-center">
            No plans for {date.format("MMMM D")}
          </h5>
        </div>
      )}
      {childPlans.data?.map((plan) => (
        <Plan name={plan.name} files={[]} area="Practical Life" />
      ))}
    </div>
  )
}

export default IndexPage
