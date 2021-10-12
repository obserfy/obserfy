import { useRouter } from "next/router"
import { ChangeEventHandler, FC, ReactNode, useState } from "react"
import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"
import Select from "$components/Select"
import SlideOver from "$components/SlideOver"
import TextFieldWithIcon from "$components/TextFieldWithIcon"
import { useQueryString } from "$hooks/useQueryString"
import useToggle from "$hooks/useToggle"
import RecordsLayout from "$layouts/RecordsLayout"
import { withAuthorization } from "$lib/auth"
import dayjs from "$lib/dayjs"
import {
  findCurriculumAreasByStudentId,
  findOldestObservationDate,
  findStudentObservations,
} from "$lib/db"
import { getQueryString, getStudentId, SSR } from "$lib/next"

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
  const filterSlideOver = useToggle()

  const areaQuery = useQueryString("area")
  const fromQuery = useQueryString("from")
  const toQuery = useQueryString("to")
  const searchQuery = useQueryString("search")

  const [area, setArea] = useState(areaQuery ?? "all")
  const [from, setFrom] = useState(dayjs(fromQuery || oldestDate))
  const [to, setTo] = useState(toQuery ? dayjs(toQuery) : today)
  const [search, setSearch] = useState(searchQuery || "")

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

  const handleChangeSearch: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const { value } = e.target
    await setQueries({ search: value })
    setSearch(value)
  }

  return (
    <RecordsLayout title="Observations">
      <div className="lg:flex items-start mx-4 lg:mt-4">
        <div className="lg:hidden sticky top-0 z-10 py-4 bg-gradient-to-b from-white via-white">
          <div className="flex">
            <TextFieldWithIcon
              label="Search"
              name="search"
              value={search}
              onChange={handleChangeSearch}
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
              <Icon
                src="/icons/filter.svg"
                className="mr-2"
                color="bg-gray-800"
              />
              Filters
            </Button>
          </div>
        </div>

        <div className="hidden lg:block sticky top-20 flex-shrink-0 p-4 mr-4 mb-6 w-full lg:w-1/3 bg-gray-100 rounded-xl">
          <h2 className="flex justify-center items-center mb-3 font-semibold leading-none opacity-50">
            <Icon
              src="/icons/filter.svg"
              className="mr-1"
              color="bg-gray-800"
            />
            Filters
          </h2>

          <TextFieldWithIcon
            label="Search"
            name="search"
            value={search}
            onChange={handleChangeSearch}
            placeholder={`"Reading ..."`}
            containerClassName="mb-2"
          />

          <Select
            defaultValue={area}
            value={area}
            onChange={handleAreaChange}
            label="Area"
            name="area"
          >
            <option value="all">All</option>
            {areas.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>

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

        <ul className="overflow-hidden w-full rounded-xl border divide-y divide-gray-200 shadow-sm">
          {observations.map(
            ({ id, short_desc, long_desc, event_time, areas: a }) => (
              <Observation
                key={id}
                areas={a}
                short_desc={short_desc}
                long_desc={long_desc}
                event_time={event_time}
              />
            )
          )}
        </ul>
      </div>

      <FilterSlideOver
        isOpen={filterSlideOver.isOn}
        close={filterSlideOver.toggle}
        form={
          <>
            <Select
              defaultValue={area}
              value={area}
              onChange={handleAreaChange}
              label="Area"
              name="area"
            >
              <option value="all">All</option>
              {areas.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>

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
          </>
        }
      />
    </RecordsLayout>
  )
}

const FilterSlideOver: FC<{
  isOpen: boolean
  close: () => void
  form: ReactNode
}> = ({ close, isOpen, form }) => (
  <SlideOver show={isOpen} onClose={close} title="Filters">
    <div className="relative flex-1 px-4 sm:px-6 pt-3 mt-3 bg-gray-50 border-t">
      {form}
    </div>

    <div className="flex flex-shrink-0 justify-end py-4 px-4 border-t">
      <Button variant="outline" onClick={close}>
        Cancel
      </Button>
      <Button className="ml-4">Save</Button>
    </div>
  </SlideOver>
)

const Observation: FC<{
  event_time: string
  short_desc: string | null
  long_desc: string | null
  areas: { name: string | null } | null
}> = ({ short_desc, areas, event_time, long_desc }) => (
  <li className="relative py-5 px-4 bg-white hover:bg-primary-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600">
    <div className="flex justify-between space-x-3">
      <button className="block text-left truncate focus:outline-none">
        <span className="absolute inset-0" aria-hidden="true" />
        <p className="font-semibold text-gray-900 truncate">{short_desc}</p>
        <p className="font-semibold text-primary-600 truncate">
          {areas?.name ?? "Others"}
        </p>
      </button>

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

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const search = getQueryString(ctx, "search")
  const area = getQueryString(ctx, "area")
  const to = getQueryString(ctx, "to")
  const from = getQueryString(ctx, "from")

  const oldestDate = await findOldestObservationDate(studentId)
  const observations = await findStudentObservations(studentId, {
    search,
    area: area === "all" ? undefined : area,
    to: to ? dayjs(to) : undefined,
    from: from ? dayjs(from) : undefined,
  })
  const areas = await findCurriculumAreasByStudentId(studentId)

  return {
    props: {
      oldestDate:
        oldestDate?.event_time?.toISOString() ?? dayjs().toISOString(),
      areas: areas ?? [],
      observations: observations.map((o) => ({
        ...o,
        created_date: o.created_date?.toISOString() ?? "",
        event_time: o.event_time?.toISOString() ?? "",
      })),
    },
  }
})

export default RecordsPage
