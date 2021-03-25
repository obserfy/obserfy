import { array, number, string, type } from "io-ts"
import { date } from "io-ts-types"
import { nullable } from "io-ts/Type"
import { LessonPlan } from "../domain"
import { isEmpty } from "../utils/array"
import dayjs from "../utils/dayjs"
import { query, typedQuery } from "./pg"

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
  selectedDate: string
): Promise<LessonPlan[]> => {
  // language=PostgreSQL
  const plans = await query(
    `
        select lp.id                  as id,
               lpd.title              as title,
               lpd.description        as description,
               a.name                 as area_name,
               a.id                   as area_id,
               max(lp.date)           as end_date,
               min(lp.date)           as start_date,
               json_agg(distinct o)   as observations,
               json_agg(distinct lpl) as links
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
        group by lp.id, lpd.title, lpd.description, a.name, a.id
        order by start_date desc
    `,
    [childId, selectedDate]
  )

  // TODO: Fix typings, bring data manipulation complexity to sql
  return plans.rows.map((plan) => ({
    id: plan.id,
    title: plan.title,
    description: plan.description,
    repetitionType: plan.repetition_type,
    startDate: plan.start_date,
    endDate: plan.end_date,
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

export const findChildLessonPlans = async (childId: string) => {
  // language=PostgreSQL
  const plans = await query(
    `
        select lpd.id              as id,
               lpd.title           as title,
               lpd.description     as description,
               a.name              as area_name,
               a.id                as area_id,
               lpd.repetition_type as repetition_type,
               max(lp.date)        as end_date,
               min(lp.date)        as start_date
        from lesson_plan_details lpd
                 left join lesson_plans lp on lp.lesson_plan_details_id = lpd.id
                 left join lesson_plan_to_students lpts on lp.id = lpts.lesson_plan_id
                 left join areas a on lpd.area_id = a.id

        where lpts.student_id = $1
        group by lpd.id, lpd.title, lpd.description, a.name, a.id
        order by start_date desc
    `,
    [childId]
  )

  // TODO: Fix typings, bring data manipulation complexity to sql
  return plans.rows.map((plan) => ({
    id: plan.id,
    title: plan.title,
    repetitionType: plan.repetition_type,
    startDate: plan.start_date,
    endDate: plan.end_date,
    area: {
      id: plan.area_id,
      name: plan.area_name,
    },
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

export const getChildObservationByImage = async (imageId: string) => {
  // language=PostgreSQL
  const result = await query(
    `
        select o.id, o.long_desc, o.short_desc, o.created_date, o.event_time
        from images as i
                 join observation_to_images oi on oi.image_id = i.id
                 join observations o on oi.observation_id = o.id
        where i.id = $1
        order by o.created_date desc
    `,
    [imageId]
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

  const now = dayjs().toISOString()
  // language=PostgreSQL
  const result = await query(
    `
        insert into observations (student_id, short_desc, long_desc, created_date, event_time, lesson_plan_id,
                                  guardian_id, area_id, visible_to_guardians)
        values ($1, $2, $3, $4, $5, $6, $7, $8, true)
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

const ChildObservationsGroupedByDate = array(
  type({
    date,
    observations: array(
      type({
        id: string,
        short_desc: string,
        long_desc: nullable(string),
        area_name: nullable(string),
        images: array(
          nullable(
            type({
              id: string,
              object_key: string,
            })
          )
        ),
      })
    ),
  })
)
export const findChildObservationsGroupedByDate = async (childId: string) =>
  // language=PostgreSQL
  typedQuery(
    ChildObservationsGroupedByDate,
    [childId],
    `
        select o1.event_time::date as date, json_agg(o3 order by event_time desc) as observations
        from observations as o1
                 left join (
            select o2.id, o2.short_desc, o2.long_desc, a.name as area_name, json_agg(i) as images
            from observations o2
                     left outer join observation_to_images oti on o2.id = oti.observation_id
                     left outer join images i on oti.image_id = i.id
                     left outer join areas a on o2.area_id = a.id
            group by o2.id, a.name, o2.short_desc, o2.long_desc
        ) o3 on o3.id = o1.id
        where o1.student_id = $1
          AND o1.visible_to_guardians = true
        group by o1.event_time::date
        order by o1.event_time::date desc
    `
  )

const ChildCurriculumProgress = array(
  type({
    id: string,
    name: string,
    subjects: array(
      type({
        id: string,
        name: string,
        order: number,
        materials: array(
          type({
            id: string,
            name: string,
            stage: number,
            order: number,
          })
        ),
      })
    ),
  })
)
export const findChildCurriculumProgress = async (childId: string) => {
  // language=PostgreSQL
  return typedQuery(
    ChildCurriculumProgress,
    [childId],
    `
        select a.id,
               a.name,
               coalesce(json_agg(subjects order by subjects."order") filter (where subjects.id is not null),
                        '[]') as subjects
        from students
                 join schools sch on students.school_id = sch.id
                 join curriculums c on sch.curriculum_id = c.id
                 join areas a on c.id = a.curriculum_id
                 left join lateral (select s.id,
                                           s.name,
                                           s.order,
                                           coalesce(json_agg(materials order by materials."order")
                                                    filter (where materials.id is not null), '[]'
                                               ) as materials
                                    from subjects as s
                                             left join lateral (select m.id,
                                                                       m.name,
                                                                       m.order,
                                                                       coalesce(smp.stage, -1) as stage
                                                                from materials m
                                                                         left join student_material_progresses smp
                                                                                   on m.id = smp.material_id and student_id = $1
                                                                where m.subject_id = s.id) materials on true
                                    where s.area_id = a.id
                                    group by s.id

            ) subjects on true
        where students.id = $1
        group by a.id
    `
  )
}

const ChildVideos = array(
  type({
    id: string,
    playback_url: string,
    thumbnail_url: string,
    created_at: date,
  })
)
export const findChildVideos = async (childId: string) => {
  // language=PostgreSQL
  return typedQuery(
    ChildVideos,
    [childId],
    `
        select v.id, v.playback_url, v.thumbnail_url, v.created_at
        from video_to_students
                 join videos v on v.id = video_to_students.video_id
        where student_id = $1
          and v.status = 'ready'
    `
  )
}

const LessonPlans = array(
  type({
    id: string,
    title: string,
    description: nullable(string),
    area_name: nullable(string),
    start_date: date,
    end_date: date,
    repetition_type: string,
  })
)
const LessonPlanLinks = array(
  type({
    id: string,
    url: string,
  })
)
export const findLessonPlanById = async (planId: string) => {
  // language=PostgreSQL
  const lessonPlan = await typedQuery(
    LessonPlans,
    [planId],
    `
        select lpd.id,
               lpd.title,
               lpd.description,
               repetition_type,
               area_id,
               material_id,
               a.name       as area_name,
               min(lp.date) as start_date,
               max(lp.date) as end_date
        from lesson_plan_details lpd
                 join lesson_plans lp on lpd.id = lp.lesson_plan_details_id
                 left join areas a on a.id = lpd.area_id
        where lpd.id = $1
        group by lpd.id, a.name
    `
  )

  if (isEmpty(lessonPlan)) return null

  // language=PostgreSQL
  const links = await typedQuery(
    LessonPlanLinks,
    [planId],
    `
        select id, url
        from lesson_plan_links
        where lesson_plan_details_id = $1
    `
  )

  return {
    ...lessonPlan[0],
    links,
  }
}

const Material = array(
  type({
    id: string,
    name: string,
    description: nullable(string),
    stage: string,
  })
)
export const findMaterialDetailsByChildId = async (
  childId: string,
  materialId: string
) => {
  // language=PostgreSQL
  return typedQuery(
    Material,
    [childId, materialId],
    `
        select m.id, m.name, m.description, coalesce(smp.stage, -1) as stage
        from materials m
                 left join student_material_progresses smp on m.id = smp.material_id and smp.student_id = $1
        where m.id = $2
    `
  )
}
