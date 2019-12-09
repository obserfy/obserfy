interface Category {
  id: string
  name: string
  color: string
  onColor: string
}

export const categories: Category[] = [
  { id: "0", name: "Others", color: "#b39ddb", onColor: "rgba(0,0,0,0.87)" },
  { id: "1", name: "Cultural", color: "#90caf9", onColor: "rgba(0,0,0,0.87)" },
  { id: "2", name: "Language", color: "#80cbc4", onColor: "rgba(0,0,0,0.87)" },
  {
    id: "3",
    name: "Mathematics",
    color: "#ffcc80",
    onColor: "rgba(0,0,0,0.87)",
  },
  {
    id: "4",
    name: "Practical Life",
    color: "#ef9a9a",
    onColor: "rgba(0,0,0,0.87)",
  },
  { id: "5", name: "Sensorial", color: "#bcaaa4", onColor: "rgba(0,0,0,0.87)" },
]
