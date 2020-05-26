import React, { useState } from "react"
import dayjs from "../utils/dayjs"
import Button from "../components/button"
import ChevronRight from "../icons/chevron-right.svg"
import ChevronLeft from "../icons/chevron-left.svg"

const IndexPage = () => {
  const [date, setDate] = useState(dayjs())

  return (
    <main className="p-3">
      <div className="flex items-center">
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
        <Button className="ml-1" outline onClick={() => setDate(dayjs())}>
          Today
        </Button>
      </div>
    </main>
  )
}

export default IndexPage
