import { navigate } from "gatsby"
import { ApiError } from "./useApi"

// TODO: rename file to apiHelpers
const BASE_URL = "/api/v1"

export const getApi = <T>(url: string) => async (): Promise<T> => {
  const result = await fetch(BASE_URL + url, {
    credentials: "same-origin",
  })

  // Throw user to login when something gets 401
  if (result.status === 401) {
    await navigate("/login")
  }

  const json = await result.json()
  if (json.error) {
    throw Error(json.error.message)
  }

  // Parse json
  return json
}

export const deleteApi = (url: string) => async () => {
  const result = await fetch(`${BASE_URL}${url}`, {
    credentials: "same-origin",
    method: "DELETE",
  })

  // Throw user to login when something gets 401
  if (result.status === 401) {
    await navigate("/login")
    return result
  }
  if (!result.ok) {
    const body: ApiError = await result.json()
    throw Error(body?.error?.message ?? "")
  }

  return result
}

export const patchApi = <T>(url: string, id: string) => async (payload: T) => {
  const result = await fetch(`${BASE_URL}${url}/${id}`, {
    credentials: "same-origin",
    method: "PATCH",
    body: JSON.stringify(payload),
  })

  // Throw user to login when something gets 401
  if (result.status === 401) {
    await navigate("/login")
    return result
  }
  if (!result.ok) {
    const body: ApiError = await result.json()
    throw Error(body?.error?.message ?? "")
  }

  return result
}

export const postApi = <T>(url: string) => async (payload: T) => {
  const result = await fetch(`${BASE_URL}${url}`, {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(payload),
  })

  // Throw user to login when something gets 401
  if (result.status === 401) {
    await navigate("/login")
    return result
  }
  if (!result.ok) {
    const body: ApiError = await result.json()
    throw Error(body?.error?.message ?? "")
  }

  return result
}

export const putApi = <T>(url: string) => async (payload: T) => {
  const result = await fetch(`${BASE_URL}${url}`, {
    credentials: "same-origin",
    method: "PUT",
    body: JSON.stringify(payload),
  })

  // Throw user to login when something gets 401
  if (result.status === 401) {
    await navigate("/login")
    return result
  }
  if (!result.ok) {
    const body: ApiError = await result.json()
    throw Error(body?.error?.message ?? "")
  }

  return result
}
