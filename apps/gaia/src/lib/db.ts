import prisma from "$lib/prisma"

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

export const findStudentObservations = (studentId: string) => {
  return prisma.observations.findMany({
    where: {
      student_id: studentId,
      visible_to_guardians: true,
    },
    orderBy: {
      event_time: "desc",
    },
    include: {
      areas: true,
      observation_to_images: {
        include: {
          images: true,
        },
      },
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
