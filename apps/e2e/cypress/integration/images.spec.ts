import { uploadFile } from "../utils"

describe("test image features", function () {
  beforeEach(function () {
    cy.registerVor()
    cy.createSchool()
    cy.createStudent()
  })

  it("should be able to add and delete images", function () {
    cy.visitVor(`/dashboard/students/gallery?studentId=${this.student.id}`)
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

    cy.visitVor("/")
    cy.get("[data-cy=profile-pic-image]").should("have.lengthOf", 1)
  })

  it.skip("should be able to upload image on gaia", function () {
    cy.exec(`yarn run db:reset ${Cypress.env("GAIA_USERNAME")}`)
    cy.createGuardian(this.student.id)
      .then(() => cy.gaiaLogin())
      .then(() => {
        cy.visitGaia("/")
        cy.contains(this.student.name).should("be.visible")
        cy.contains("Images").click()
        cy.get<HTMLInputElement>("#upload-image-small").then((el) => {
          uploadFile(el, this.logo)
        })
        cy.get("[data-cy=image]").should("have.lengthOf", 1)
        cy.get<HTMLInputElement>("#upload-image").then((el) => {
          uploadFile(el, this.logo)
        })
        cy.wait(200)
        cy.get("[data-cy=image]").should("have.lengthOf", 2)
        cy.get("[data-cy=image]").first().click()
        cy.get("[data-cy=close]").click()
      })
  })
})
