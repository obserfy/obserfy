import Link from "next/link"
import { FC } from "react"
import { withPageAuthRequired } from "$lib/auth"
import Icon from "$components/Icon/Icon"
import Markdown from "$components/Markdown/Markdown"
import MaterialStagePill from "$components/MaterialStagePill"
import useGetMaterialDetails from "$hooks/api/useGetMaterialDetails"
import { useQueryString } from "$hooks/useQueryString"
import BaseLayout from "$layouts/BaseLayout"

const Details: FC = () => {
  const studentId = useQueryString("studentId")
  const materialId = useQueryString("materialId")

  const details = useGetMaterialDetails(studentId, materialId)

  return (
    <BaseLayout title="Assessments">
      <div className="flex items-center px-1 mx-auto w-full max-w-3xl">
        <Link href={`/${studentId}/assessments`}>
          <button className="m-1 hover:text-green-700">
            <Icon src="/icons/arrow-back.svg" className="m-2 w-4 h-4" />
          </button>
        </Link>
        <Link href={`/${studentId}/assessments`}>
          <a className="text-xs">Progress</a>
        </Link>
        <div className="mx-3">/</div>
        <div className="text-xs text-green-700">Details</div>
      </div>

      {details.data && (
        <div className="px-3 mx-auto max-w-3xl">
          <div className="flex items-center p-3 px-3 bg-white rounded border">
            <div className="flex flex-col">
              <div className="opacity-80">Material Name</div>
              <h1 className="text-lg font-bold">{details.data?.name}</h1>
            </div>

            {details.data.stage !== "-1" && (
              <MaterialStagePill
                stage={parseInt(details.data.stage, 10)}
                className="py-1 ml-auto font-bold"
              />
            )}
          </div>

          {details.data.description && (
            <div className="p-3 mt-3 bg-white border">
              Description
              <Markdown markdown={details.data.description} className="mt-3" />
            </div>
          )}
        </div>
      )}
    </BaseLayout>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default Details
