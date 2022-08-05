// TODO: rename file to apiHelpers
const BASE_URL = "/api"

export const getApi =
  <T>(url: string) =>
  async (): Promise<T> => {
    const result = await fetch(BASE_URL + url, {
      credentials: "same-origin",
    })

    const json = await result.json()
    if (!result.ok) {
      mixpanel.track("Request Failed", {
        method: "GET",
        status: result.status,
        message: json.error.message,
      })
      throw Error(json.error)
    }

    // Parse json
    return json
  }

export const deleteApi = (url: string) => async () => {
  const result = await fetch(`${BASE_URL}${url}`, {
    credentials: "same-origin",
    method: "DELETE",
  })

  if (!result.ok) {
    const body = await result.json()
    mixpanel.track("Request Failed", {
      method: "DELETE",
      status: result.status,
      message: body?.error?.message,
    })
    throw Error(body?.error ?? "")
  }

  return result
}

export const patchApi =
  <T>(url: string) =>
  async (payload: T) => {
    const result = await fetch(`${BASE_URL}${url}`, {
      credentials: "same-origin",
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    if (!result.ok) {
      const body = await result.json()
      mixpanel.track("Request Failed", {
        method: "PATCH",
        status: result.status,
        message: body?.error?.message,
      })
      throw Error(body?.error ?? "")
    }

    return result
  }

export const postApi =
  <T>(url: string) =>
  async (payload: T) => {
    const result = await fetch(`${BASE_URL}${url}`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(payload),
    })

    if (!result.ok) {
      const body = await result.json()
      mixpanel.track("Request Failed", {
        method: "POST",
        status: result.status,
        message: body?.error?.message,
      })
      throw Error(body?.error ?? "")
    }

    return result
  }

export const postFile =
  (url: string) => async (image: { file: File; id: string }) => {
    const payload = new FormData()
    payload.append("image", image.file)

    const result = await fetch(`${BASE_URL}${url}`, {
      credentials: "same-origin",
      method: "POST",
      body: payload,
    })

    if (!result.ok) {
      const body = await result.json()
      mixpanel.track("Request Failed", {
        method: "POST FILE",
        status: result.status,
        message: body?.error?.message,
      })
      throw Error(body?.error ?? "")
    }

    return result
  }
