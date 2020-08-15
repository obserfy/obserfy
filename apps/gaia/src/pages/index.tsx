import React, { FC, useState } from "react"
import Head from "next/head"
import Img from "react-optimized-image"
import { Svg } from "react-optimized-image/lib"
import dayjs, { Dayjs } from "../utils/dayjs"
import Button from "../components/Button/Button"
import ChevronRight from "../icons/chevron-right.svg"
import ChevronLeft from "../icons/chevron-left.svg"
import useGetChildPlans from "../hooks/api/useGetChildPlans"
import { useQueryString } from "../hooks/useQueryString"
import NoPlanIllustration from "../images/no-plan-illustration.svg"
import LinkIcon from "../icons/link.svg"
import Plan from "../components/Plan/Plan"

const IndexPage = () => {
  const [date, setDate] = useState(dayjs())
  const childId = useQueryString("childId")
  const childPlans = useGetChildPlans(childId, date)

  return (
    <div>
      <Head>
        <title>Home | Obserfy for Parents</title>
      </Head>
      <div className="max-w-3xl mx-auto flex items-center p-3">
        <div className="text-sm">{date.format("ddd, DD MMM 'YY")}</div>
        <Button
          className="ml-auto"
          outline
          iconOnly
          onClick={() => setDate(date.add(-1, "day"))}
        >
          <Img src={ChevronLeft} />
        </Button>
        <Button
          className="ml-1"
          outline
          iconOnly
          onClick={() => setDate(date.add(1, "day"))}
        >
          <Img alt="Next date" src={ChevronRight} />
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
      {(childPlans.data?.length ?? 0) === 0 && (
        <EmptyPlansIllustration
          loading={childPlans.status === "loading"}
          date={date}
        />
      )}
      <div className="max-w-3xl mx-auto md:px-3">
        {childPlans.data?.map((plan) => (
          <Plan
            name={plan.title}
            files={[]}
            area={plan.area?.name}
            description={plan.description}
            links={plan.links}
          />
        ))}
      </div>
    </div>
  )
}

const EmptyPlansIllustration: FC<{ loading: boolean; date: Dayjs }> = ({
  loading,
  date,
}) => {
  return (
    <div
      className={`flex flex-col items-center py-16 ${
        loading && "opacity-50"
      } transition-opacity duration-200`}
    >
      <Img src={NoPlanIllustration} className="w-64 md:w-1/2 mb-3" />
      <h5
        className={`text-2xl mx-4 text-center ${
          loading && "opacity-0"
        } transition-opacity duration-200`}
      >
        No plans for {date.format("MMMM D")}
      </h5>
    </div>
  )
}

export default IndexPage
