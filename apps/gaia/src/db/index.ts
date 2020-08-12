import { Pool } from "pg"
import { LessonPlan } from "../domain"
import dayjs from "../utils/dayjs"

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

export const findLessonPlanByChildIdAndDate = async (
  childId: string,
  date: string
): Promise<LessonPlan[]> => {
  // language=PostgreSQL
  const plans = await query(
    `
              select lp.id              as id,
                     lpd.title          as title,
                     lpd.description    as description,
                     a.name             as areaName,
                     a.id               as areaid,
                     lp.date            as date,
                     array_agg(lpl.url) as urls,
                     array_agg(lpl.id)  as url_ids
              from lesson_plans lp
                       left join lesson_plan_details lpd on lp.lesson_plan_details_id = lpd.id
                       left join lesson_plan_to_students lpts on lp.id = lpts.lesson_plan_id
                       left join areas a on lpd.area_id = a.id
                       left join lesson_plan_links lpl on lpd.id = lpl.lesson_plan_details_id
              where lpts.student_id = $1
                AND ($2::date IS NULL OR lp.date::date = $2::date)
              group by lp.id, lpd.title, lpd.description, a.name, a.id, lp.date
    `,
    [childId, date]
  )

  return plans.rows.map((plan) => ({
    id: plan.id,
    title: plan.title,
    description: plan.description,
    date: dayjs(plan.date),
    student: [],
    area: {
      id: plan.areaid,
      name: plan.areaname,
    },
    links: plan.urls
      .map((url, idx) => {
        if (url) {
          return { url, id: plan.url_ids[idx] }
        }
        return null
      })
      .filter((url) => url),
  }))
}
