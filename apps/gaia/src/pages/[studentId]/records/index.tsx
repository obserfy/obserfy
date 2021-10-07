import clsx from "clsx"
import RecordsHeroImage from "$components/RecordsHeroImage"
import BaseLayout from "$layouts/BaseLayout"

const tabs = [
  { name: "Observations", href: "#", current: true },
  { name: "Assessments", href: "#", current: false },
]

const RecordsPage = () => {
  return (
    <BaseLayout title="Records | Observations" className="max-w-7xl">
      <div className="overflow-hidden relative mx-4 mt-2 sm:mt-4 rounded-2xl shadow-md">
        <RecordsHeroImage className="absolute inset-0" />

        <div className="relative p-4 pt-16 bg-gradient-to-t from-[rgba(0,0,0,0.4)]">
          <h1 className="mb-4 text-3xl font-bold text-white">Records</h1>
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={clsx(
                  tab.current
                    ? "text-white bg-black bg-opacity-50"
                    : "text-white bg-black bg-opacity-0 hover:bg-opacity-20 opacity-80",
                  "py-2 px-3 text-sm font-medium rounded-md"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex">
        <div />
        <div />
      </div>
    </BaseLayout>
  )
}

export default RecordsPage
