import * as faker from "faker"
import { uploadFile } from "../../utils"

describe("test student features", function () {
  beforeEach(function () {
    // cy.clearSW()
    cy.fixedClearCookies()
    cy.registerVor()
  })

  it("should be able to create, edit, and delete students", function () {
    cy.visit("/dashboard/students/new")

    // ========= add first student
    const student1 = {
      id: faker.datatype.uuid(),
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

    cy.fixture("icon.png").as("logo")
    cy.get<HTMLInputElement>("[data-cy=upload-profile-pic]").then((el) => {
      uploadFile(el, this.logo)
    })
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
    cy.visit("/dashboard/students")
    cy.contains(student2.name).click()
    cy.contains("Profile").click()

    const newName = "jane"
    cy.get("[aria-label=edit-name]").click()
    cy.contains("label", "Name").find("input").clear().type(newName)
    cy.contains("Save").click()
    cy.contains(newName).should("be.visible")

    cy.get('[aria-label="edit-gender"]').click()
    cy.contains("label", "Gender").find("select").select("1")
    cy.contains("Save").click()
    cy.contains("Male").should("be.visible")

    cy.get('[aria-label="edit-student id"]').click()
    cy.contains("label", "Student ID").find("input").clear().type("test")
    cy.contains("Save").click()
    cy.contains("test").should("be.visible")

    cy.get('[aria-label="edit-date of birth"]').click()
    cy.wait(100)
    cy.contains("button:visible", "6").click()
    cy.get("[data-cy=confirm]").click()
    cy.contains("6").should("be.visible")

    cy.get('[aria-label="edit-date of entry"]').click()
    cy.contains("button:visible", "7").click()
    cy.get("[data-cy=confirm]").click()
    cy.contains("7").should("be.visible")

    cy.get("[data-cy=edit-class]").click()
    cy.get(`[data-cy=remove-class]`).click()
    cy.contains("Yes").click()

    cy.get(`[data-cy=remove-class]`).should("not.exist")
    cy.get(`[data-cy=add-class]`).click()
    cy.get(`[data-cy=add-class]`).should("not.exist")
    cy.get(`[data-cy=remove-class]`).should("be.visible")
    cy.get(`[data-cy=remove-class]`).click()
    cy.contains("Yes").click()

    cy.contains("Student Profile").click()
    cy.get("@class").then((newClass: any) => {
      cy.contains(newClass.name).should("not.exist")
    })

    const guardian = {
      name: faker.name.firstName(),
      email: "gilfoyle@obserfy.com",
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(true),
      note: faker.lorem.paragraph(2),
    }
    cy.get("[data-cy=add-guardian]").click()
    cy.contains("label", "Relationship").find("select").select("Father")
    cy.contains("Guardian Name").type(guardian.name)
    cy.contains("Email").type(guardian.email)
    cy.contains("Phone").type(guardian.phone)
    cy.contains("Address").type(guardian.address)
    cy.contains("Note").type(guardian.note)
    cy.contains("button", "Add").click()
    cy.contains(student2.guardianName).should("be.visible")
    cy.contains(guardian.name).should("be.visible")

    cy.get(`[data-cy=remove-${guardian.name}]`).click()
    cy.contains("Delete").click()
    cy.get(`[data-cy=remove-${student2.guardianName}]`).click()
    cy.contains("Delete").click()
    cy.contains(student2.guardianName).should("not.exist")
    cy.contains(guardian.name).should("not.exist")

    cy.get("[data-cy=add-guardian]").click()
    cy.contains("From existing").click()
    cy.contains(guardian.name).should("be.visible")
    cy.contains(student2.guardianName).should("be.visible")
    cy.contains(guardian.name).should("be.visible").click()
    cy.contains("button", "Add").click()

    cy.contains(guardian.name).should("be.visible")

    // ==== test inactive
    cy.contains(newName).should("be.visible")
    cy.contains("Set as Inactive").click()
    cy.contains("Yes").click()
    cy.visit("/dashboard/students")
    cy.contains(newName).should("not.exist")
  })
})
