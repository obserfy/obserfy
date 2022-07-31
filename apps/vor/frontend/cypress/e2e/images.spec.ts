import { uploadFile } from "../utils"

describe("test image features", function () {
  beforeEach(function () {
    cy.registerVor()
    cy.createSchool()
    cy.createStudent()
  })

  it("should be able to add and delete images", function () {
    cy.visit(`/dashboard/students/gallery?studentId=${this.student.id}`)
    cy.wait(1000)

    cy.fixture("icon.png").as("logo")
    cy.get<HTMLInputElement>("[data-cy=upload-image]").then((el) => {
      uploadFile(el, this.logo)
    })
    cy.get<HTMLInputElement>("[data-cy=upload-image]").then((el) => {
      uploadFile(el, this.logo)
    })
    cy.get<HTMLInputElement>("[data-cy=upload-image]").then((el) => {
      uploadFile(el, this.logo)
    })
    cy.wait(200)
    cy.get("[data-cy=image]").should("have.lengthOf", 3)

    cy.get("[data-cy=image]").first().click()
    cy.contains("Delete").click()
    cy.get("[data-cy=confirm]").click()
    cy.get("[data-cy=image]").should("have.lengthOf", 2)

    cy.get("[data-cy=image]").first().click()
    cy.contains("Set as Profile").click()
    cy.get("[data-cy=confirm]").click()

    cy.visit("/")
    cy.get("[data-cy=profile-pic-image]").should("have.lengthOf", 1)
  })
})
