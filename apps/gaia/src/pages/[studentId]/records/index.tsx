import { useRouter } from "next/router"
import { ChangeEventHandler, useState } from "react"
import { useQueryString } from "$hooks/useQueryString"
import RecordsLayout from "$layouts/RecordsLayout"
import { withAuthorization } from "$lib/auth"
import {
  findCurriculumAreasByStudentId,
  findStudentObservations,
} from "$lib/db"
import { getStudentId, SSR } from "$lib/next"
import dayjs from "$lib/dayjs"

const today = dayjs()

const useSetQueries = () => {
  const router = useRouter()
  return async (query: any) => {
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, ...query },
    })
  }
}

const RecordsPage: SSR<typeof getServerSideProps> = ({
  observations,
  areas,
  oldestDate,
}) => {
  const setQueries = useSetQueries()

  const areaQuery = useQueryString("area")
  const fromQuery = useQueryString("from")
  const toQuery = useQueryString("to")

  const [area, setArea] = useState(areaQuery ?? "all")
  const [from, setFrom] = useState(dayjs(fromQuery || oldestDate))
  const [to, setTo] = useState(toQuery ? dayjs(toQuery) : today)

  const handleAreaChange: ChangeEventHandler<HTMLSelectElement> = async (e) => {
    await setQueries({ area: e.target.value })
    setArea(e.target.value)
  }

  const handleFromChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const value = dayjs(e.target.value || oldestDate)
    await setQueries({ from: value.format("YYYY-MM-DD") })
    setFrom(value)
  }

  const handleToChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const value = dayjs(e.target.value || today)
    await setQueries({ to: value.format("YYYY-MM-DD") })
    setTo(value)
  }

  return (
    <RecordsLayout title="Observations">
      <div className="sm:flex items-start m-4">
        <div className="hidden lg:block sticky top-20 flex-shrink-0 mr-4 w-1/3 rounded-xl">
          <label htmlFor="areas">
            <span className="block text-sm font-medium text-gray-700">
              Area
            </span>
            <select
              id="areas"
              name="areas"
              className="block py-2 pr-10 pl-3 mt-1 w-full text-base sm:text-sm rounded-md border-gray-200 focus:border-primary-500 focus:ring-primary-500 shadow-sm focus:outline-none"
              defaultValue={area}
              value={area}
              onChange={handleAreaChange}
            >
              <option value="all">All</option>
              {areas.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <div className="isolate mt-4 -space-y-px bg-white rounded-md shadow-sm">
            <label
              htmlFor="date-from"
              className="block relative focus-within:z-10 py-2 px-3 rounded-md rounded-b-none border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
            >
              <span className="block text-sm font-medium text-gray-700">
                From
              </span>
              <input
                type="date"
                name="date-from"
                id="date-from"
                className="block p-0 w-full placeholder-gray-500 text-gray-900 border-0 focus:ring-0"
                value={from.format("YYYY-MM-DD")}
                min={dayjs(oldestDate).format("YYYY-MM-DD")}
                max={to.format("YYYY-MM-DD")}
                onChange={handleFromChange}
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
                value={to.format("YYYY-MM-DD")}
                min={from.format("YYYY-MM-DD")}
                max={today.format("YYYY-MM-DD")}
                onChange={handleToChange}
              />
            </label>
          </div>
        </div>

        <ul className="overflow-hidden rounded-xl border divide-y divide-gray-200 shadow-sm">
          {observations.map(
            ({ id, short_desc, long_desc, event_time, areas: a }) => (
              <li
                key={id}
                className="relative py-5 px-4 bg-white hover:bg-primary-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600"
              >
                <div className="flex justify-between space-x-3">
                  <a href="#" className="block truncate focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="font-semibold text-gray-900 truncate">
                      {short_desc}
                    </p>
                    <p className="font-semibold text-primary-600 truncate">
                      {a?.name ?? "Others"}
                    </p>
                  </a>

                  <time
                    dateTime={event_time}
                    className="flex flex-shrink-0 text-gray-500 whitespace-nowrap"
                  >
                    {dayjs(event_time).format("DD MMM YYYY")}
                  </time>
                </div>
                <div className="mt-1">
                  <p className="text-gray-600 line-clamp-2">{long_desc}</p>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </RecordsLayout>
  )
}

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const observations = await findStudentObservations(studentId)
  const areas = await findCurriculumAreasByStudentId(studentId)

  const firstDate =
    observations.length > 0
      ? observations[observations.length - 1].event_time?.toISOString()
      : undefined

  return {
    props: {
      oldestDate: firstDate,
      areas: areas ?? [],
      observations: observations.map((o) => ({
        ...o,
        created_date: o.created_date?.toISOString(),
        event_time: o.event_time?.toISOString(),
      })),
    },
  }
})

export default RecordsPage
