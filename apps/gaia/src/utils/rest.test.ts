import { createMocks } from "node-mocks-http"
import { apiRoute } from "./rest"

test("api route should catch error", async () => {
  const handler = apiRoute(() => {
    throw Error("Something went wrong")
  })

  const { req, res } = createMocks({
    method: "GET",
  })
  await handler(req, res)
  expect(res._getStatusCode()).toBe(500)
})

export {}
