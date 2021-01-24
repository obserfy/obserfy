import * as faker from "faker"

describe("test student features", function () {
  beforeEach(function () {
    cy.clearSW()
    cy.fixedClearCookies()
    cy.registerVor()
  })

  it("should be able to create, edit, and delete students", function () {
    cy.visitVor("/dashboard/students/new")

    // ========= add first student
    const student1 = {
      id: faker.random.uuid(),
      name: faker.name.firstName(),
      notes: faker.lorem.lines(1),
    }
    cy.contains("Name").type(student1.name)
    cy.get(`[data-cy="Date of Birth"]`).click()
    cy.get(`[data-cy="confirm"]`).click()
    cy.get(`[data-cy="Date of Entry"]`).click()
    cy.get(`[data-cy="confirm"]`).click()
    cy.contains("Gender").find("select").select("Male")
    cy.contains("Student ID").type(student1.id)
    cy.contains("Notes").type(student1.notes)
    cy.contains("Save").click()
    cy.contains(student1.name).should("exist")

    // ===== add second student
    cy.createClass()
    const student2 = {
      id: faker.random.uuid(),
      name: faker.name.firstName(),
      notes: faker.lorem.lines(1),
      guardianName: faker.name.firstName(),
    }
    cy.get("[data-cy=addStudent]").first().click({ force: true })
    cy.get("[data-cy=upload-profile-pic]").attachFile("icon.png")
    cy.contains("Name").type(student2.name)
    cy.get(`[data-cy="Date of Birth"]`).click()
    cy.get(`[data-cy="confirm"]`).click()
    cy.get(`[data-cy="Date of Entry"]`).click()
    cy.get(`[data-cy="confirm"]`).click()
    cy.contains("Gender").find("select").select("Male")
    cy.contains("Student ID").type(student2.id)
    cy.contains("Notes").type(student1.notes)
    // ====== create and set class
    cy.get("@class").then((newClass: any) => {
      cy.contains(newClass.name).click()
    })
    // ====== test choosing guardian flow
    cy.get("[data-cy=add-guardian]").click()
    cy.contains("Guardian Name").type(student2.guardianName)
    cy.contains("Create").click()
    cy.get("[data-cy=finish-cta]").click()
    cy.contains(student2.guardianName).should("be.visible")
    cy.get(`[data-cy=delete-${student2.guardianName}]`).click()
    cy.contains("Yes").click()
    cy.contains(student2.guardianName).should("not.exist")
    cy.get("[data-cy=add-guardian]").click()
    cy.contains("From existing").click()
    cy.contains(student2.guardianName).click()
    cy.get("[data-cy=finish-cta]").click()
    cy.contains(student2.guardianName).should("be.visible")

    cy.contains("Save").click()
    cy.contains(student2.name).should("exist")
    // check that second student have proper profile pic set
    cy.get("[data-cy=profile-pic-placeholder]")
      .filter(":visible")
      .should("have.lengthOf", 1)

    // test edit student
    cy.visitVor("/dashboard/students")
    cy.contains(student2.name).click()
    cy.contains("Profile").click()
  })
})
