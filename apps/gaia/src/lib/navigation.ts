export const navigationItems = (studentId: string) => [
  {
    href: `/${studentId}`,
    text: "Home",
    iconSrc: "/icons/home.svg",
    exact: true,
  },
  {
    href: `/${studentId}/lesson-plans`,
    text: "Lessons",
    iconSrc: "/icons/book.svg",
  },
  {
    href: `/${studentId}/reports`,
    text: "Reports",
    iconSrc: "/icons/folder.svg",
  },
  {
    href: `/${studentId}/records`,
    text: "Records",
    iconSrc: "/icons/archive.svg",
  },
  {
    href: `/${studentId}/media`,
    text: "Media",
    iconSrc: "/icons/camera.svg",
  },
]
