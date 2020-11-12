import React, { FC } from "react"
import Image from "next/image"

const Progress = () => {
  return <EmptyCurriculumPlaceholder />
}

const EmptyCurriculumPlaceholder: FC<{ loading?: boolean }> = ({ loading }) => (
  <div
    className={`flex flex-col items-center pt-8 ${
      loading && "opacity-50"
    } transition-opacity duration-200 max-w-3xl mx-auto`}
  >
    <Image src="/undraw_shared_goals_3d12.svg" width={250} height={250} />
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

export default Progress
