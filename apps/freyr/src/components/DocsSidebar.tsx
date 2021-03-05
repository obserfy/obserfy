import { t, Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Link } from "./Link"

const DocsSidebar = () => (
  <div className="prose prose-sm pb-6">
    <SidebarHeader text={t`Concepts`} />
    <SidebarEntry text={t`Introductions`} to="/docs" />

    <SidebarHeader text={t`Basics`} />
    <SidebarEntry text={t`Inviting your team`} to="/docs/inviting-your-team" />
    <SidebarEntry
      text={t`Giving access to parents`}
      to="/docs/giving-access-to-parents"
    />
    <SidebarEntry text={t`Getting help`} to="/docs/getting-help" />
    <SidebarEntry
      text={t`Formatting using Markdown`}
      to="/docs/markdown-support"
    />

    {/* <SidebarHeader text={t`School`} /> */}
    {/* <SidebarEntry text={t`Curriculum`} to="/docs/curriculum" /> */}
    {/* <SidebarEntry text={t`Text formatting`} /> */}

    {/* <SidebarHeader text={t`School`} /> */}
    {/* <SidebarEntry text={t`Curriculum`} /> */}
    {/* <SidebarEntry text={t`Classes`} /> */}

    {/* <SidebarHeader text={t`Students`} /> */}
    {/* <SidebarEntry text={t`Student profiles`} /> */}
    {/* <SidebarEntry text={t`Guardian profiles`} /> */}
    {/* <SidebarEntry text={t`Sharing data to guardians`} /> */}
    {/* <SidebarEntry text={t`Media gallery`} /> */}

    {/* <SidebarHeader text={t`Observations`} /> */}
    {/* <SidebarEntry text={t`Manage observations`} /> */}
    {/* <SidebarEntry text={t`Exporting observations`} /> */}

    {/* <SidebarHeader text={t`Lesson Plans`} /> */}
    {/* <SidebarEntry text={t`Creating Lesson plan`} /> */}
    {/* <SidebarEntry text={t`Repetitions`} /> */}
    {/* <SidebarEntry text={t`Related students`} /> */}
  </div>
)

const SidebarHeader: FC<{ text: string; to?: string }> = ({ text }) => (
  <h4>
    <Trans id={text} />
  </h4>
)

const SidebarEntry: FC<{ text: string; to?: string }> = ({
  text,
  to = "/docs/coming-soon",
}) => (
  <Link
    to={to}
    className="no-underline hover:underline block border-l pl-3 py-1 text-gray-700"
    activeClassName="border-primary text-green-600 font-bold"
  >
    <h5>
      <Trans id={text} />
    </h5>
  </Link>
)

export default DocsSidebar
