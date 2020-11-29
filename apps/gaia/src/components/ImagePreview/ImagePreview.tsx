import React, { FC, useLayoutEffect, useRef } from "react"
import Image from "next/image"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import { ChildImage } from "../../hooks/api/useGetChildImages"

import useGetChild from "../../hooks/api/useGetChild"
import useGetObservationsByImage from "../../hooks/api/useGetImageObservation"
import dayjs from "../../utils/dayjs"
import Icon from "../Icon/Icon"

const ImagePreview: FC<{
  childId: string
  img: ChildImage
  onDismiss: () => void
}> = ({ img, onDismiss, childId }) => {
  const ref = useRef<HTMLDivElement>(null)
  const child = useGetChild(childId)
  const observations = useGetObservationsByImage(img.id)
  useLayoutEffect(() => {
    if (ref.current) {
      disableBodyScroll(ref.current, {
        reserveScrollBarGap: true,
        allowTouchMove: (el) => el.tagName === "TEXTAREA",
      })
    }
    return () => {
      if (ref.current) enableBodyScroll(ref.current)
    }
  }, [])

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      ref={ref}
      className="fixed h-screen w-screen bg-overlay top-0 left-0 right-0 bottom-0 z-50 flex md:items-center justify-center overflow-y-auto scrolling-touch"
      onClick={onDismiss}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */}
      <div
        className="
          w-full
          max-w-2xl
          bg-white
          max-h-screen
        "
        onClick={(e) => e.stopPropagation()}
        style={{ minHeight: 300 }}
      >
        <div className="flex items-center p-3">
          <Image
            alt="profile"
            src="/images/student_pic_placeholder.jpg"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <div className="ml-3 font-bold">{child.data?.name}</div>
            <div className="ml-3 text-xs opacity-75">
              {dayjs(img.createdAt).format("dddd, DD MMM YYYY")}
            </div>
          </div>
          <button className="ml-auto" onClick={onDismiss}>
            <Icon src="/icons/close.svg" size={20} />
          </button>
        </div>
        <img
          src={img.originalImageUrl}
          alt="preview"
          className="w-full object-cover"
        />
        {observations.data?.map((obv) => (
          <div className="m-4">
            <div className="font-bold">{obv.shortDesc}</div>
            <div className="font-normal">{obv.longDesc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ImagePreview
