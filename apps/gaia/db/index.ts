import { Pool } from "pg"

const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10),
  max: parseInt(process.env.MAX_CLIENTS, 10) || 10,
  ssl: process.env.NODE_ENV === "production" && {
    cert: process.env.PG_CERT,
    rejectUnauthorized: false,
  },
})

pgPool.on("error", (err) => {
  console.error("Unexpected error in PostgresSQL connection pool", err)
})

const query = async (sql: string, params: string[]) => {
  const client = await pgPool.connect()
  try {
    return await client.query(sql, params)
  } finally {
    client.release()
  }
}

export const findChildrenByGuardianEmail = async (guardianEmail: string) => {
  // language=PostgreSQL
  const result = await query(
    `
              select s.id, s.name
              from students s
                       join guardian_to_students gts on s.id = gts.student_id
                       join guardians g on gts.guardian_id = g.id
              where g.email = $1
    `,
    [guardianEmail]
  )
  return result.rows
}

export const findChildById = async (guardianEmail: string, childId: string) => {
  // language=PostgreSQL
  const result = await query(
    `
              select s.id, s.name, school.name as school_name, s.profile_pic
              from students s
                       join schools school on s.school_id = school.id
                       join guardian_to_students gts on s.id = gts.student_id
                       join guardians g on gts.guardian_id = g.id
              where g.email = $1
                and s.id = $2
    `,
    [guardianEmail, childId]
  )
  return result.rows[0]
}

export async function findLessonPlanByChildId(childId: string) {
  // language=PostgreSQL
  const result = await query(
    `
              select lp.id           as id,
                     lpd.title       as title,
                     lpd.description as description
              from lesson_plans lp
                       join lesson_plan_details lpd on lp.lesson_plan_details_id = lpd.id
                       join lesson_plan_to_students lpts on lp.id = lpts.lesson_plan_id
              where lpts.student_id = $1
    `,
    [childId]
  )
  return result.rows
}
