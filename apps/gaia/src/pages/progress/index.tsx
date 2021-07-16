import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { FC, useState } from "react"
import Button from "../../components/Button/Button"
import Chip from "../../components/Chip/Chip"
import MaterialStagePill from "../../components/MaterialStagePill"
import useGetCurriculumProgress from "../../hooks/api/useGetCurriculumProgress"
import { useQueryString } from "../../hooks/useQueryString"
import ChevronRightIcon from "../../icons/chevron-right.svg"

const ProgressPage = () => {
  const [areaIdx, setAreaIdx] = useState(0)
  const childId = useQueryString("childId")
  const {
    data: progress,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetCurriculumProgress(childId)

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

      <div className="font-bold px-3 pt-3">CURRICULUM AREAS</div>
      <div className="flex flex-wrap pt-2 md-rounded pl-1">
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
      <div className="font-bold px-3 pb-3 pt-6">MATERIALS</div>

      {progress[areaIdx].subjects.map((subject) => (
        <div
          key={subject.id}
          className="bg-white mb-6 border md:rounded md:mx-3"
        >
          <div className="px-3 my-3 font-bold">{subject.name}</div>

          {subject.materials.map((material) => (
            <Link
              href={`/progress/details?childId=${childId}&materialId=${material.id}`}
            >
              <a
                key={material.id}
                className="flex px-3 py-2 items-center display-block hover:bg-primaryLightest"
              >
                <div className="pr-3">{material.name}</div>
                <MaterialStagePill stage={material.stage} className="ml-auto" />
                <ChevronRightIcon className="opacity-60 ml-3" />
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
      No curriculum progress data <br />
      available yet
    </h5>
  </div>
)

const ErrorIllustration: FC<{
  onRetryClick: () => void
}> = ({ onRetryClick }) => (
  <div className="flex flex-col items-center pt-8 transition-opacity duration-200 max-w-3xl mx-auto">
    <Image
      alt="empty curriculum illustration"
      src="/undraw_network.svg"
      width={250}
      height={250}
    />
    <h5 className="text-xl mx-4 text-center transition-opacity duration-200 font-bold">
      We can&apos;t seem to connect to the server, please try again.
    </h5>
    <Button onClick={onRetryClick}>Retry</Button>
  </div>
)

const LoadingState: FC = () => (
  <div className="mx-auto max-w-3xl">
    <div className="bg-gray-300 rounded p-3 my-3 w-48 mx-3" />
    <div className="flex mx-3 flex-wrap">
      <div className="bg-gray-300 rounded p-3 my-3 w-24 mr-3" />
      <div className="bg-gray-300 rounded p-3 my-3 w-24 mr-3" />
      <div className="bg-gray-300 rounded p-3 my-3 w-24 mr-3" />
      <div className="bg-gray-300 rounded p-3 my-3 w-24 mr-3" />
      <div className="bg-gray-300 rounded p-3 my-3 w-24 mr-3" />
    </div>

    <div className="bg-gray-300 rounded p-3 mb-3 mt-6 w-48 mx-3" />
    <div className="bg-gray-300 rounded p-3 my-3 h-64" />
    <div className="bg-gray-300 rounded p-3 my-3 h-64" />
    <div className="bg-gray-300 rounded p-3 my-3 h-64" />
    <div className="bg-gray-300 rounded p-3 my-3 h-64" />
  </div>
)

export default withPageAuthRequired(ProgressPage)
