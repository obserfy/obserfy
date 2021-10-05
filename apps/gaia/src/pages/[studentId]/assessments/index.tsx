import Button from "$components/Button/Button"
import Chip from "$components/Chip/Chip"
import Icon from "$components/Icon/Icon"
import MaterialStagePill from "$components/MaterialStagePill"
import useGetCurriculumProgress from "$hooks/api/useGetCurriculumProgress"
import { useQueryString } from "$hooks/useQueryString"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { FC, useState } from "react"

const ProgressPage = () => {
  const [areaIdx, setAreaIdx] = useState(0)
  const studentId = useQueryString("studentId")
  const {
    data: progress,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetCurriculumProgress(studentId)

  if (isLoading) {
    return <LoadingState />
  }

  if (isSuccess && progress?.length === 0) {
    return <EmptyCurriculumPlaceholder loading={isLoading} />
  }

  if (isError || !progress) {
    return <ErrorIllustration onRetryClick={() => refetch()} />
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Head>
        <title>Curriculum Progress | Obserfy for Parents</title>
      </Head>

      <div className="px-3 pt-3 font-bold">CURRICULUM AREAS</div>
      <div className="flex flex-wrap pt-2 pl-1 md-rounded">
        {progress.map((area, idx) => (
          <Chip
            key={area.id}
            containerStyle="ml-2 mb-2"
            isActive={idx === areaIdx}
            onClick={() => setAreaIdx(idx)}
          >
            {area.name}
          </Chip>
        ))}
      </div>
      <div className="px-3 pt-6 pb-3 font-bold">MATERIALS</div>

      {progress[areaIdx].subjects.map((subject) => (
        <div
          key={subject.id}
          className="md:mx-3 mb-6 bg-white md:rounded border"
        >
          <div className="px-3 my-3 font-bold">{subject.name}</div>

          {subject.materials.map((material) => (
            <Link
              href={`/${studentId}/assessments/details?materialId=${material.id}`}
            >
              <a
                key={material.id}
                className="flex items-center py-2 px-3 hover:bg-primaryLightest"
              >
                <div className="pr-3">{material.name}</div>
                <MaterialStagePill stage={material.stage} className="ml-auto" />
                <Icon
                  src="/icons/chevron-right.svg"
                  className="ml-3 opacity-60"
                />
              </a>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

const EmptyCurriculumPlaceholder: FC<{ loading?: boolean }> = ({ loading }) => (
  <div
    className={`flex flex-col items-center pt-8 ${
      loading && "opacity-50"
    } transition-opacity duration-200 max-w-3xl mx-auto`}
  >
    <Image
      alt="empty curriculum illustration"
      src="/undraw_shared_goals_3d12.svg"
      width={250}
      height={250}
    />
    <h5
      className={`text-xl mx-4 text-center ${
        loading && "opacity-0"
      } transition-opacity duration-200 font-bold`}
    >
      No assessments have been made
    </h5>
  </div>
)

const ErrorIllustration: FC<{
  onRetryClick: () => void
}> = ({ onRetryClick }) => (
  <div className="flex flex-col items-center pt-8 mx-auto max-w-3xl transition-opacity duration-200">
    <Image
      alt="empty curriculum illustration"
      src="/undraw_network.svg"
      width={250}
      height={250}
    />
    <h5 className="mx-4 text-xl font-bold text-center transition-opacity duration-200">
      We can&apos;t seem to connect to the server, please try again.
    </h5>
    <Button onClick={onRetryClick}>Retry</Button>
  </div>
)

const LoadingState: FC = () => (
  <div className="mx-auto max-w-3xl">
    <div className="p-3 my-3 mx-3 w-48 bg-gray-300 rounded" />
    <div className="flex flex-wrap mx-3">
      <div className="p-3 my-3 mr-3 w-24 bg-gray-300 rounded" />
      <div className="p-3 my-3 mr-3 w-24 bg-gray-300 rounded" />
      <div className="p-3 my-3 mr-3 w-24 bg-gray-300 rounded" />
      <div className="p-3 my-3 mr-3 w-24 bg-gray-300 rounded" />
      <div className="p-3 my-3 mr-3 w-24 bg-gray-300 rounded" />
    </div>

    <div className="p-3 mx-3 mt-6 mb-3 w-48 bg-gray-300 rounded" />
    <div className="p-3 my-3 h-64 bg-gray-300 rounded" />
    <div className="p-3 my-3 h-64 bg-gray-300 rounded" />
    <div className="p-3 my-3 h-64 bg-gray-300 rounded" />
    <div className="p-3 my-3 h-64 bg-gray-300 rounded" />
  </div>
)

export default withPageAuthRequired(ProgressPage)
