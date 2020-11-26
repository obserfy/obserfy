const { Client } = require("pg")
const { config } = require("dotenv")

config({ path: "../../.env.development" })
config({ path: "../../.env.local" })

const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: "defaultdb",
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? "5432", 10),
})

const resetDB = async () => {
  await client.connect()
  try {
    // language=PostgreSQL
    await client.query("begin transaction")
    // language=PostgreSQL
    await client.query(`
      truncate table weekdays cascade;

      truncate table image_to_students cascade;

      truncate table student_to_classes cascade;

      truncate table guardian_to_students cascade;

      truncate table student_material_progresses cascade;

      truncate table sessions cascade;

      truncate table user_to_schools cascade;

      truncate table attendances cascade;

      truncate table password_reset_tokens cascade;

      truncate table lesson_plan_links cascade;

      truncate table observation_to_images cascade;

      truncate table observations cascade;

      truncate table guardians cascade;

      truncate table file_to_lesson_plans cascade;

      truncate table files cascade;

      truncate table lesson_plan_to_students cascade;

      truncate table students cascade;

      truncate table images cascade;

      truncate table lesson_plans cascade;

      truncate table lesson_plan_details cascade;

      truncate table materials cascade;

      truncate table subjects cascade;

      truncate table areas cascade;

      truncate table classes cascade;

      truncate table schools cascade;

      truncate table curriculums cascade;

      truncate table subscriptions cascade;

      truncate table users cascade;
  `)
    // language=PostgreSQL
    await client.query("commit")
    await client.end()
  } catch (e) {
    console.log(e)
  }
}

resetDB()
