import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Head from "next/head"
import Link from "next/link"
import { FC } from "react"
import Markdown from "../../components/Markdown/Markdown"
import MaterialStagePill from "../../components/MaterialStagePill"
import useGetMaterialDetails from "../../hooks/api/useGetMaterialDetails"
import { useQueryString } from "../../hooks/useQueryString"
import BackIcon from "../../icons/arrow-back.svg"

const Details: FC = () => {
  const childId = useQueryString("childId")
  const materialId = useQueryString("materialId")

  const details = useGetMaterialDetails(childId, materialId)

  return (
    <div>
      <Head>
        <title>Curriculum Progress | Obserfy for Parents</title>
      </Head>

      <div className="w-full max-w-3xl mx-auto flex px-1 items-center">
        <Link href={`/progress?childId=${childId}`}>
          <button className="m-1 hover:text-green-700">
            <BackIcon className="w-4 h-4 m-2" />
          </button>
        </Link>
        <Link href={`/progress?childId=${childId}`}>
          <a className="text-xs">Progress</a>
        </Link>
        <div className="mx-3">/</div>
        <div className="text-xs text-green-700">Details</div>
      </div>

      {details.data && (
        <div className="mx-auto max-w-3xl px-3">
          <div className="flex items-center p-3 rounded border bg-white px-3">
            <div className="flex flex-col">
              <div className="opacity-80">Material Name</div>
              <h1 className="text-lg font-bold">{details.data?.name}</h1>
            </div>

            {details.data.stage !== "-1" && (
              <MaterialStagePill
                stage={parseInt(details.data.stage, 10)}
                className="ml-auto font-bold py-1"
              />
            )}
          </div>

          {details.data.description && (
            <div className="p-3 bg-white border mt-3">
              Description
              <Markdown markdown={details.data.description} className="mt-3" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default withPageAuthRequired(Details)
