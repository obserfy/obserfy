import nanoid from "nanoid"
import { name } from "faker"
import { renderHook } from "@testing-library/react-hooks"
import { get, keys } from "idb-keyval"
import isEqual from "lodash/isEqual"
import { Student } from "../useGetStudent"
import { useStudentsCache } from "./studentCache"

describe("Student Cache", () => {
  let students: Student[] = []

  beforeEach(() => {
    students = [
      {
        id: nanoid(),
        name: name.firstName(),
        dateOfBirth: new Date().toISOString(),
      },
      {
        id: nanoid(),
        name: name.firstName(),
        dateOfBirth: new Date().toISOString(),
      },
      {
        id: nanoid(),
        name: name.firstName(),
        dateOfBirth: new Date().toISOString(),
      },
      {
        id: nanoid(),
        name: name.firstName(),
        dateOfBirth: new Date().toISOString(),
      },
    ]
  })

  it("should store api data", async () => {
    const schoolId = nanoid()
    const { waitForValueToChange, result, rerender } = renderHook(
      props => useStudentsCache(schoolId, props.students),
      { initialProps: { students } }
    )

    students.push({
      dateOfBirth: new Date().toISOString(),
      name: name.firstName(),
      id: nanoid(),
    })
    rerender({ students })

    const studentsWithSchoolId = students.map(student => ({
      ...student,
      schoolId,
    }))
    await waitForValueToChange(() => {
      return isEqual(result.current, studentsWithSchoolId)
    })
    expect(result.current).toEqual(studentsWithSchoolId)
    const idbKeys = await keys()
    const savedData = await get(idbKeys[0])
    expect(savedData).toEqual(studentsWithSchoolId)
  })
})
