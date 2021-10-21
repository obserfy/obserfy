import prisma from "$lib/prisma"
import { Dayjs } from "$lib/dayjs"

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
        gte: where?.from?.toDate(),
        lte: where?.to?.toDate(),
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
              images: { select: { object_key: true } },
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

export const findStudentByStudentId = (id: string) => {
  return prisma.students.findUnique({
    where: { id },
  })
}

export const findStudentLessonPlans = (studentId: string) => {
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
      lesson_plan_to_students: {
        some: {
          student_id: studentId,
        },
      },
    },
  })
}
