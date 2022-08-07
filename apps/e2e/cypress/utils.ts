// eslint-disable-next-line import/prefer-default-export
export const uploadFile = (
  subject: JQuery<HTMLInputElement>,
  fileFixture: string
) => {
  const blob = Cypress.Blob.base64StringToBlob(fileFixture, "image/png")

  const file = new File([blob], "images/logo.png", { type: "image/png" })
  const list = new DataTransfer()

  list.items.add(file)
  subject[0].files = list.files
  subject[0].dispatchEvent(new Event("change", { bubbles: true }))

  return subject
}
