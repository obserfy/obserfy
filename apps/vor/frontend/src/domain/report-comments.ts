import { useCallback } from "react"
import create from "zustand"

interface CommentStore {
  comments: Map<string, string>

  setComment(
    reportId: string,
    studentId: string,
    areaId: string,
    comment: string
  ): void
}

export const useComment = create<CommentStore>((set) => ({
  comments: new Map<string, string>(),
  setComment: (
    reportId: string,
    studentId: string,
    areaId: string,
    comment: string
  ) => {
    set((state) => {
      const id = `${reportId}-${studentId}-${areaId}`
      state.comments.set(id, comment)
    })
  },
}))

export const selectComment = (
  reportId: string,
  studentId: string,
  areaId: string
) => {
  return useCallback(
    (state: CommentStore) => {
      return state.comments.get(`${reportId}-${studentId}-${areaId}`)
    },
    [reportId, studentId, areaId]
  )
}
