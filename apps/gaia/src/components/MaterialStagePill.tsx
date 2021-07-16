import { FC } from "react"
import { materialStageToString } from "../domain"

const MaterialStagePill: FC<{ className?: string; stage: number }> = ({
  stage,
  className,
}) => {
  let bgColor = "bg-black"
  let textColor = "text-white"
  if (stage === 0) {
    bgColor = "bg-assessments-presented"
    textColor = "text-assessments-onPresented"
  }
  if (stage === 1) {
    bgColor = "bg-assessments-practiced"
    textColor = "text-assessments-onPracticed"
  }
  if (stage === 2) {
    bgColor = "bg-assessments-mastered"
    textColor = "text-assessments-onMastered"
  }

  return (
    <div className={`rounded-full px-2 ${className} ${bgColor} ${textColor}`}>
      {materialStageToString(stage)}
    </div>
  )
}

export default MaterialStagePill
