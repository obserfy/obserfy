import React, { FC, useState } from "react"
import Image from "next/image"
import useGetCurriculumProgress from "../hooks/api/useGetCurriculumProgress"
import { useQueryString } from "../hooks/useQueryString"
import Button from "../components/Button/Button"
import Chip from "../components/Chip/Chip"
import { materialStageToString } from "../domain"

const Progress = () => {
  const [areaId, setAreaId] = useState(0)
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
      <div className="font-bold px-3 pt-3">CURRICULUM AREAS</div>
      <div className="flex flex-wrap pt-2 md-rounded pl-1">
        {progress.map((area, idx) => (
          <Chip
            key={area.id}
            containerStyle="ml-2 mb-2"
            isActive={idx === areaId}
            onClick={() => setAreaId(idx)}
          >
            {area.name}
          </Chip>
        ))}
      </div>
      <div className="font-bold px-3 pb-3 pt-6">MATERIALS</div>
      {progress[areaId].subjects.map((subject) => (
        <div
          key={subject.id}
          className="bg-white mb-6 border md:rounded md:mx-3"
        >
          <div className="px-3 my-3 font-bold">{subject.name}</div>
          <div>
            {subject.materials.map((material) => (
              <div key={material.id} className="flex px-3 my-3 items-center">
                <div className="pr-3">{material.name}</div>
                <Stage stage={material.stage} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const Stage: FC<{ stage: number }> = ({ stage }) => {
  let color = "text-black"
  if (stage === 0) {
    color = "text-orange-700"
  }
  if (stage === 1) {
    color = "text-yellow-700"
  }
  if (stage === 2) {
    color = "text-green-700"
  }

  return (
    <div className={`ml-auto ${color}`}>{materialStageToString(stage)}</div>
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

const LoadingState: FC = () => {
  return (
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
}

export default Progress
