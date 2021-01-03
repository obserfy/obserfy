import dayjs from "../dayjs"
import { isTrialOverdue } from "./useIsTrialOverdue"

describe("useIsTrialOverdue", () => {
  it("should be false when less than a month", () => {
    const createdDate = dayjs().toISOString()

    const result = isTrialOverdue(createdDate)
    expect(result).toBe(false)
  })

  it("should be true when more than a month", () => {
    const createdDate = dayjs().add(-1, "month").toISOString()

    const result = isTrialOverdue(createdDate)
    expect(result).toBe(true)
  })

  it("should be false when subscription exists", () => {
    const createdDate = dayjs().add(-1, "month").toISOString()

    const result = isTrialOverdue(createdDate, {
      id: "",
      status: "",
      cancelUrl: "",
      nextBillDate: "",
      updateUrl: "",
    })
    expect(result).toBe(false)
  })
})
