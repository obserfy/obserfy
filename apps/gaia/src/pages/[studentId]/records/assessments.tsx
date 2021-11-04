import { useRouter } from "next/router"
import { ChangeEvent, FC, useEffect, useState } from "react"
import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"
import Markdown from "$components/Markdown/Markdown"
import Select from "$components/Select"
import SlideOver from "$components/SlideOver"
import TextFieldWithIcon from "$components/TextFieldWithIcon"
import useGetMaterialDetails from "$hooks/api/useGetMaterialDetails"
import useDebounce from "$hooks/useDebounce"
import { useQueryString } from "$hooks/useQueryString"
import RecordsLayout from "$layouts/RecordsLayout"
import { withAuthorization } from "$lib/auth"
import {
  findCurriculumAreasByStudentId,
  findMaterialAssessmentByStudentIdAndAreaId,
} from "$lib/db"
import { getQueryString, getStudentId, SSR } from "$lib/next"
import useToggle from "$hooks/useToggle"

const AssessmentRecordsPage: SSR<typeof getServerSideProps> = ({
  subjects,
  areas,
  defaultArea,
}) => {
  const studentId = useQueryString("studentId")

  const queries = useFilterQueries()
  const setQueries = useSetQueries()

  const materialPreview = useToggle()
  const [area, setArea] = useState(queries.area || defaultArea)
  const [search, setSearch] = useState(queries.search || "")
  const [materialPreviewId, setMaterialPreviewId] = useState("")

  const debouncedSearch = useDebounce(search, 250)
  useEffect(() => {
    if (queries.search !== debouncedSearch) {
      setQueries({ search: debouncedSearch })
    }
  }, [debouncedSearch, queries.search, setQueries])

  const handleAreaChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    await setQueries({ area: e.target.value })
    setArea(e.target.value)
  }

  const handleBulkChange = async (val: { search: string; area: string }) => {
    if (val.area !== area) {
      await setQueries({ area: val.area })
      setArea(val.area)
    }
    if (val.search !== search) {
      setSearch(val.search)
    }
  }

  return (
    <RecordsLayout title="Assessments" currentPage="Assessments">
      <div className="lg:flex items-start mx-4 lg:mt-4">
        <Select
          defaultValue={area}
          value={area}
          onChange={handleAreaChange}
          label="Area"
          name="area"
          containerClassName="lg:hidden mt-4 -mb-2 z-20 relative"
          selectClassName="rounded-xl"
          hideLabel
        >
          {areas.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>

        <div className="lg:hidden sticky top-0 z-10 py-4 bg-gradient-to-b from-white via-white">
          <TextFieldWithIcon
            label="Material Name"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`"Number ..."`}
            containerClassName="rounded-lg w-full"
            inputClassName="!rounded-xl"
            hideLabel
          />
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
            label="Material Name"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`"Number ..."`}
            containerClassName="mb-2"
          />

          <Select
            defaultValue={area}
            value={area}
            onChange={handleAreaChange}
            label="Area"
            name="area"
          >
            {areas.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>

          {(search !== "" || area !== defaultArea) && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={async () => {
                await handleBulkChange({ search: "", area: defaultArea })
              }}
            >
              Reset
            </Button>
          )}
        </div>

        <ul className="w-full">
          {subjects.map(({ id, name, materials }) => (
            <li className="mb-4 w-full rounded-xl border shadow-sm" key={id}>
              <div className="p-4">
                <p className="text-xs tracking-wider text-gray-800 uppercase">
                  Subject
                </p>
                <h3 className="text-xl font-bold text-gray-700">{name}</h3>
              </div>

              <div className="flex py-2 pl-4 text-sm font-semibold text-gray-600 bg-gray-100 border-y">
                <p>Material Name</p>
                <p className="mr-4 ml-auto">Assessment</p>
              </div>

              <ul className="overflow-hidden mb-1 w-full divide-y divide-gray-200">
                {materials.map((m) => (
                  <li key={m.id}>
                    <button
                      className="flex items-center py-2 pr-2 pl-4 w-full text-gray-700 hover:bg-primary-50"
                      onClick={() => {
                        setMaterialPreviewId(m.id)
                        materialPreview.toggle()
                      }}
                    >
                      <h4 className="mr-auto truncate">{m.name}</h4>
                      <AssessmentIndicator stage={m.stage} />
                    </button>
                  </li>
                ))}

                {materials.length === 0 && (
                  <div className="px-8 mt-8 mb-12 text-center">
                    <Icon
                      src="/icons/search.svg"
                      className="mx-auto !w-10 !h-10"
                      color="bg-gray-400"
                    />
                    <h3 className="mt-2 font-medium text-gray-900">
                      No material found
                    </h3>
                    <p className="mt-1 text-gray-500">
                      {search
                        ? `No material named "${search}" under ${name}.`
                        : `${name} has no material.`}
                    </p>
                  </div>
                )}
              </ul>
            </li>
          ))}

          {subjects.length === 0 && (
            <div className="px-8 mt-8 mb-12 text-center">
              <Icon
                src="/icons/search.svg"
                className="mx-auto !w-10 !h-10"
                color="bg-gray-400"
              />
              <h3 className="mt-2 font-medium text-gray-900">
                No subjects found
              </h3>
              <p className="mt-1 text-gray-500">
                We can&apos;t seem to find any subjects related to{" "}
                {areas.find(({ id }) => area === id)?.name}
              </p>
            </div>
          )}
        </ul>
      </div>

      <AssessmentsSlideOver
        studentId={studentId}
        materialId={materialPreviewId}
        onClose={materialPreview.toggle}
        show={materialPreview.isOn}
      />
    </RecordsLayout>
  )
}

const AssessmentsSlideOver: FC<{
  show: boolean
  onClose: () => void
  studentId: string
  materialId: string
}> = ({ studentId, materialId, show, onClose }) => {
  const { data: details } = useGetMaterialDetails(studentId, materialId)

  return (
    <SlideOver title="Material Assessment" onClose={onClose} show={show}>
      <div className="h-full bg-gray-50 border-t">
        <div className="flex flex-col items-start p-4 sm:px-6">
          <p className="text-gray-600">Name</p>
          <h4 className="mb-2 text-lg font-bold leading-tight text-gray-800">
            {details?.name}
          </h4>

          {details && details?.stage !== "-1" && (
            <AssessmentIndicator stage={details?.stage?.toString()} />
          )}
          {details && details?.stage === "-1" && (
            <p className="px-2 text-sm text-gray-900 bg-gray-200 rounded-full border">
              Net yet Introduced
            </p>
          )}
        </div>

        {details?.description && (
          <div className="p-4 sm:px-6 pt-8 mt-4 bg-gray-50 border-t">
            <p className="text-gray-600">About this Material</p>
            <Markdown
              markdown={details?.description}
              className="mt-3 text-gray-800"
            />
          </div>
        )}
      </div>
    </SlideOver>
  )
}

const AssessmentIndicator: FC<{
  className?: string
  stage: string
}> = ({ stage, className }) => {
  let style = ""
  if (stage === "0") {
    style = "bg-red-100 text-red-900 "
  }
  if (stage === "1") {
    style = "bg-orange-100 text-orange-900 "
  }
  if (stage === "2") {
    style = "bg-emerald-100 text-emerald-900"
  }

  return (
    <p className={`rounded-full px-2 text-sm ${className} ${style}`}>
      {getAssessmentText(stage)}
    </p>
  )
}

export const getAssessmentText = (stage: string) => {
  if (stage === "0") return "Presented"
  if (stage === "1") return "Practiced"
  if (stage === "2") return "Mastered"
  return ""
}

const useSetQueries = () => {
  const router = useRouter()
  return async (query: any) => {
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, ...query },
    })
  }
}

const useFilterQueries = () => ({
  area: useQueryString("area"),
  search: useQueryString("search"),
})

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const search = getQueryString(ctx, "search")

  const areas = (await findCurriculumAreasByStudentId(studentId)) ?? []
  const defaultArea = areas?.[0].id
  const area = getQueryString(ctx, "area") || defaultArea

  const subjects = await findMaterialAssessmentByStudentIdAndAreaId(
    studentId,
    area,
    { search }
  )

  return {
    props: {
      defaultArea: areas?.[0].id,
      areas: areas.map(({ id, name }) => ({ id, name })),
      subjects: subjects.map(({ id, name, materials }) => ({
        id,
        name,
        materials: materials.map((m) => ({
          id: m.id,
          name: m.name,
          order: m.order?.toString(),
          stage: m.student_material_progresses[0]?.stage.toString() ?? null,
        })),
      })),
    },
  }
})

export default AssessmentRecordsPage
