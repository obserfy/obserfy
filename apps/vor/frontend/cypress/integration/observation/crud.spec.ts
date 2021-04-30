import { uploadFile } from "../../utils"

describe("observation crud", function () {
  beforeEach(function () {
    cy.registerVor()
    cy.createStudent()
  })

  it("should be able to create, edit, and delete observation", function () {
    // =========================== Create Observation ==========================
    cy.visit("/dashboard/students")
    cy.contains(this.student.name).click()
    cy.contains("Create observation").click()

    cy.contains("Short Description").type("A new description")
    cy.contains("Visible to guardians").click()
    cy.get("[data-cy=markdown-editor]").type("A detail")
    // cy.contains("Go to curriculum").click() // should show empty curriculum info when curriculum is empty
    cy.contains("Event Time").click()
    cy.contains("25").click()
    cy.contains("Set").click()
    cy.get("[data-cy=image]").should("have.lengthOf", 0) // ensure no images uploaded

    cy.fixture("icon.png").as("logo")
    cy.get<HTMLInputElement>("[data-cy=upload-image]")
      .then((el) => {
        uploadFile(el, this.logo)
      })
      .wait(10_000)

    cy.get("[data-cy=image]").should("have.lengthOf", 1)
    cy.get<HTMLInputElement>("[data-cy=upload-image]")
      .then((el) => {
        uploadFile(el, this.logo)
      })
      .wait(10_000)
    cy.get("[data-cy=image]").should("have.lengthOf", 2)

    cy.contains("Save").click()

    cy.contains("A new description").should("be.visible")
    cy.contains("A detail").should("be.visible")
    cy.get("[data-cy=observation-image]").should("have.lengthOf", 2)

    // =========================== Edit Observation ==========================
    // edit description
    cy.contains("A new description").click()
    cy.get("[aria-label=edit-short-description]").click()
    cy.contains("label:visible", "Short Description").type(" great")
    cy.contains("Save").click()
    cy.contains("A new description great").should("be.visible")

    // edit time
    cy.get("[aria-label=edit-event-time]").click()
    cy.contains("18").click()
    cy.contains("Set").click()
    cy.contains("18").should("be.visible")

    // edit area (should show how to create curriculum)
    cy.get("[aria-label=edit-details]").click()
    cy.get("[data-cy=markdown-editor]").type(" better details here")
    cy.contains("Save").click()
    cy.contains("A detail better details here").should("be.visible")

    // add image
    cy.get<HTMLInputElement>("[data-cy=upload-image]").then((el) => {
      uploadFile(el, this.logo)
    })
    cy.get("[data-cy=image]").should("have.lengthOf", 3)
    cy.get("[data-cy=image]").first().click()
    cy.get("[data-cy=delete-image]").click()
    cy.get("[data-cy=image]").should("have.lengthOf", 2)

    // =========================== Delete Observation ==========================
    cy.get("[data-cy=delete-observation]").click()
    cy.contains("Yes").click()
    cy.contains("A new description great").should("not.exist")
  })
})
