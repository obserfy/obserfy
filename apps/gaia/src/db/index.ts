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
              select lp.id                     as id,
                     lpd.title                 as title,
                     lpd.description           as description,
                     a.name                    as areaName,
                     a.id                      as areaid,
                     lp.date                   as date,
                     array_agg(lpl.url)        as urls,
                     array_agg(lpl.id)         as url_ids,
                     array_agg(o.id)           as observation_ids,
                     array_agg(o.long_desc)    as observations,
                     array_agg(o.created_date) as observation_created_dates
              from lesson_plans lp
                       left join lesson_plan_details lpd on lp.lesson_plan_details_id = lpd.id
                       left join lesson_plan_to_students lpts on lp.id = lpts.lesson_plan_id
                       left join areas a on lpd.area_id = a.id
                       left join lesson_plan_links lpl on lpd.id = lpl.lesson_plan_details_id
                       left join observations o on lp.id = o.lesson_plan_id
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
    observations: plan.observation_ids
      .map((id, idx) => {
        if (id) {
          return {
            id,
            observation: plan.observations[idx],
            createdAt: plan.observation_created_dates[idx],
          }
        }
        return null
      })
      .filter((observation) => observation),
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

export const insertObservationToPlan = async (
  planId: string,
  parentEmail: string,
  childId: string,
  observation: string
) => {
  const plan = await query(
    `
              select title, area_id
              from lesson_plans lp
                       join lesson_plan_details lpd on lpd.id = lp.lesson_plan_details_id
              where lp.id = $1
    `,
    [planId]
  )

  // language=PostgreSQL
  const parent = await query(
    `
              select id
              from guardians
              where email = $1
    `,
    [parentEmail]
  )

  const now = dayjs()
  // language=PostgreSQL
  const result = await query(
    `
              insert into observations (student_id, short_desc, long_desc, created_date, event_time, lesson_plan_id,
                                        guardian_id, area_id)
              values ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      childId,
      plan.rows[0].title,
      observation,
      now,
      now,
      planId,
      parent.rows[0].id,
      plan.rows[0].area_id,
    ]
  )

  return result.rowCount
}
