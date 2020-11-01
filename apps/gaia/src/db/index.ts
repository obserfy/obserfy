import { Pool, PoolClient } from "pg"
import { LessonPlan } from "../domain"
import dayjs from "../utils/dayjs"
import { findChildObservationsGroupedByDateQuery } from "./queries"

const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT ?? "5432", 10),
  max: parseInt(process.env.MAX_CLIENTS ?? "10", 10),
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

const typedQuery = async <P, R>(
  sql: (params: P, dbConnection: PoolClient) => Promise<R>,
  params: P
): Promise<R> => {
  const client = await pgPool.connect()
  try {
    return await sql(params, client)
  } finally {
    client.release()
  }
}

export const findChildrenByGuardianEmail = async (guardianEmail: string) => {
  // language=PostgreSQL
  const result = await query(
    `
              select s.id, s.name, s2.name as school_name
              from students s
                       join guardian_to_students gts on s.id = gts.student_id
                       join guardians g on gts.guardian_id = g.id
                       join schools s2 on s2.id = g.school_id
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
              select s.id, s.name, school.name as school_name, s.school_id, s.profile_image_id, i.object_key
              from students s
                       join schools school on s.school_id = school.id
                       join guardian_to_students gts on s.id = gts.student_id
                       join guardians g on gts.guardian_id = g.id
                       left outer join images i on s.profile_image_id = i.id
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
              select lp.id           as id,
                     lpd.title       as title,
                     lpd.description as description,
                     a.name          as area_name,
                     a.id            as area_id,
                     lp.date         as date,
                     lpd.id          as lpd_id,
                     json_agg(o)     as observations,
                     json_agg(lpl)   as links
              from lesson_plans lp
                       left join lesson_plan_details lpd on lp.lesson_plan_details_id = lpd.id
                       left join lesson_plan_to_students lpts on lp.id = lpts.lesson_plan_id
                       left join areas a on lpd.area_id = a.id

                  -- find related observations
                       left join lateral (
                  select id, long_desc as observation, created_date as created_at, lesson_plan_id
                  from observations
                  where observations.student_id = $1
                  ) o on o.lesson_plan_id = lp.id

                  -- find links
                       left join lateral (
                  select id, url, lesson_plan_details_id
                  from lesson_plan_links
                  ) lpl on lpl.lesson_plan_details_id = lpd.id

              where lpts.student_id = $1
                AND ($2::date IS NULL OR lp.date::date = $2::date)
              group by lp.id, lpd.title, lpd.description, a.name, a.id, lp.date, lpd.id
    `,
    [childId, date]
  )

  // TODO: Fix typings
  return plans.rows.map((plan) => ({
    id: plan.id,
    title: plan.title,
    description: plan.description,
    date: dayjs(plan.date),
    student: [],
    area: {
      id: plan.area_id,
      name: plan.area_name,
    },
    observations: plan.observations
      .filter((observation: any) => observation)
      .map(({ id, observation, created_at }: any) => ({
        id,
        observation,
        createdAt: created_at,
      })),
    links: plan.links.filter((url: string) => url),
  }))
}

export const getChildImages = async (childId: string) => {
  // language=PostgreSQL
  const result = await query(
    `
              select i.student_id, image.object_key, i.image_id, image.created_at as created_at
              from image_to_students i
                       join images image on image.id = i.image_id
              where i.student_id = $1
              order by image.created_at desc
    `,
    [childId]
  )
  return result.rows
}

export const insertObservationToPlan = async (
  planId: string,
  parentEmail: string,
  childId: string,
  observation: string
) => {
  // language=PostgreSQL
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

export const deleteObservation = async (id: string) => {
  // language=PostgreSQL
  const result = await query(
    `
              delete
              from observations
              where id = $1
    `,
    [id]
  )
  return result.rowCount
}

export const updateObservation = async (id: string, observation: string) => {
  // language=PostgreSQL
  const result = await query(
    `
              update observations
              set long_desc = $1
              where id = $2
    `,
    [observation, id]
  )
  return result.rowCount
}

export const insertImage = async (
  imageId: string,
  objectKey: string,
  schoolId: string,
  studentId: string
) => {
  try {
    // language=PostgreSQL
    await query(`BEGIN TRANSACTION`, [])
    await query(
      `
                insert into images (id, school_id, object_key)
                values ($1, $2, $3)
      `,
      [imageId, schoolId, objectKey]
    )
    await query(
      `
                insert into image_to_students (student_id, image_id)
                values ($1, $2)
      `,
      [studentId, imageId]
    )
    await query(`COMMIT`, [])
    return true
  } catch (e) {
    await query(`ROLLBACK`, [])
    throw e
  }
}

export const findChildObservationsGroupedByDate = async (childId: string) => {
  return typedQuery(findChildObservationsGroupedByDateQuery.run, { childId })
}
