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
