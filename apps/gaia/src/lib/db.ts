import prisma from "$lib/prisma"
import { Dayjs } from "$lib/dayjs"
import { generateOriginalUrl } from "../utils/imgproxy"

export const findStudentProgressReports = async (student_id: string) => {
  return prisma.student_progress_reports.findMany({
    where: {
      student_id,
    },
  })
}

export const findRelatedStudents = async (userEmail: string) => {
  return prisma.students.findMany({
    include: {
      images: { select: { object_key: true } },
    },
    where: {
      guardian_to_students: {
        some: {
          guardians: {
            email: userEmail,
          },
        },
      },
    },
  })
}

export const findOneOfRelatedStudent = async (userEmail: string) => {
  return prisma.students.findFirst({
    where: {
      guardian_to_students: {
        some: {
          guardians: {
            email: userEmail,
          },
        },
      },
    },
  })
}

export const findStudentAndGuardianById = (id: string, userEmail: string) => {
  return prisma.students.findFirst({
    include: {
      guardian_to_students: {
        where: {
          guardians: {
            email: userEmail,
          },
        },
      },
    },
    where: { id },
  })
}

export const findStudentObservations = (
  studentId: string,
  where?: {
    search?: string
    area?: string | null
    to?: Dayjs
    from?: Dayjs
  }
) => {
  return prisma.observations.findMany({
    where: {
      student_id: studentId,
      visible_to_guardians: true,
      area_id: where?.area,
      event_time: {
        gte: where?.from?.startOf("day").toDate(),
        lte: where?.to?.endOf("day").toDate(),
      },
      OR: !where?.search
        ? undefined
        : [
            {
              short_desc: {
                contains: where.search,
                mode: "insensitive",
              },
            },
            {
              long_desc: {
                contains: where.search,
                mode: "insensitive",
              },
            },
          ],
    },
    orderBy: {
      event_time: "desc",
    },
    include: {
      areas: true,
      observation_to_images: {
        include: {
          images: {
            select: {
              object_key: true,
            },
          },
        },
      },
    },
  })
}

export const findOldestObservationDate = (studentId: string) => {
  return prisma.observations.findFirst({
    where: {
      student_id: studentId,
    },
    orderBy: {
      event_time: "asc",
    },
    select: {
      event_time: true,
    },
  })
}

export const findCurriculumAreasByStudentId = (studentId: string) => {
  return prisma.areas.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      curriculums: {
        schools: {
          some: {
            students: {
              some: {
                id: studentId,
              },
            },
          },
        },
      },
    },
  })
}

export const findMaterialAssessmentByStudentIdAndAreaId = async (
  studentId: string,
  areaId: string,
  where?: { search?: string }
) => {
  return prisma.subjects.findMany({
    orderBy: {
      order: "asc",
    },
    where: {
      area_id: areaId,
    },
    include: {
      materials: {
        orderBy: {
          order: "asc",
        },
        where: {
          name: {
            contains: where?.search,
            mode: "insensitive",
          },
        },
        include: {
          student_material_progresses: {
            select: {
              stage: true,
            },
            where: {
              student_id: studentId,
            },
          },
        },
      },
    },
  })
}

export const findImagesByStudentId = (studentId: string) => {
  return prisma.images.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      image_to_students: {
        some: {
          student_id: studentId,
        },
      },
    },
  })
}

export const findImageByStudentIdAndImageId = (
  studentId: string,
  imageId: string
) => {
  return prisma.images.findFirst({
    include: {
      schools: true,
      observation_to_images: {
        include: {
          observations: {
            include: {
              areas: true,
            },
          },
        },
      },
      image_to_students: {
        include: {
          students: {
            include: {
              images: { select: { object_key: true } },
            },
          },
        },
      },
    },
    where: {
      id: imageId,
      image_to_students: {
        some: {
          student_id: studentId,
        },
      },
    },
  })
}

export const findRelatedImageByImageId = (imageId: string) => {
  return prisma.images.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      id: {
        not: imageId,
      },
      observation_to_images: {
        some: {
          observations: {
            observation_to_images: {
              some: {
                image_id: imageId,
              },
            },
          },
        },
      },
    },
  })
}

export const findVideosByStudentId = (studentId: string) => {
  return prisma.videos.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      video_to_students: {
        some: {
          student_id: studentId,
        },
      },
    },
  })
}

export const findOtherVideosByStudentId = (
  studentId: string,
  excludedVideoId: string
) => {
  return prisma.videos.findMany({
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      thumbnail_url: true,
    },
    where: {
      id: {
        not: excludedVideoId,
      },
      video_to_students: {
        some: {
          student_id: studentId,
        },
      },
    },
  })
}

export const findVideoByStudentIdAndImageId = (
  studentId: string,
  imageId: string
) => {
  return prisma.videos.findFirst({
    include: {
      schools: true,
      video_to_students: {
        include: {
          students: {
            include: {
              images: {
                select: { object_key: true },
              },
            },
          },
        },
      },
    },
    where: {
      id: imageId,
      video_to_students: {
        some: {
          student_id: studentId,
        },
      },
    },
  })
}

export const findStudentByStudentId = (studentId: string) => {
  return prisma.students.findUnique({
    include: {
      schools: true,
    },
    where: { id: studentId },
  })
}

export const findStudentLessonPlans = (
  studentId: string,
  where?: {
    search?: string
    area?: string
    to?: Dayjs
    from?: Dayjs
  }
) => {
  return prisma.lesson_plans.findMany({
    orderBy: {
      date: "desc",
    },
    include: {
      lesson_plan_details: {
        include: {
          areas: true,
        },
      },
    },
    where: {
      date: {
        gte: where?.from?.startOf("day").toDate(),
        lte: where?.to?.endOf("day").toDate(),
      },
      lesson_plan_details: {
        areas: where?.area === "others" ? null : { id: where?.area },
      },
      lesson_plan_to_students: {
        some: {
          student_id: studentId,
        },
      },
      OR: !where?.search
        ? undefined
        : [
            {
              lesson_plan_details: {
                title: {
                  contains: where.search,
                  mode: "insensitive",
                },
              },
            },
            {
              lesson_plan_details: {
                description: {
                  contains: where.search,
                  mode: "insensitive",
                },
              },
            },
          ],
    },
  })
}

export const findLessonPlanById = (lessonPlanId: string) => {
  return prisma.lesson_plans.findUnique({
    where: { id: lessonPlanId },
    include: {
      observations: {
        include: {
          users: true,
          guardians: true,
        },
        orderBy: {
          event_time: "asc",
        },
      },
      lesson_plan_details: {
        include: {
          lesson_plan_links: true,
          file_to_lesson_plans: true,
          areas: true,
        },
      },
    },
  })
}

export const findOldestLessonPlanDateByStudentId = (studentId: string) => {
  return prisma.lesson_plans.findFirst({
    select: {
      date: true,
    },
    orderBy: {
      date: "asc",
    },
    where: {
      lesson_plan_to_students: {
        some: {
          student_id: studentId,
        },
      },
    },
  })
}

export const findReportsByStudentId = (studentId: string) => {
  return prisma.progress_reports.findMany({
    where: {
      student_progress_reports: {
        some: {
          student_id: studentId,
        },
      },
    },
  })
}
