import { t, Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Link } from "./Link"

const DocsSidebar = () => (
  <div className="prose prose-sm">
    <SidebarHeader text={t`Concepts`} />
    <SidebarEntry text={t`Introductions`} to="/docs" />

    <SidebarHeader text={t`School`} />
    <SidebarEntry text={t`Inviting your team`} />
    <SidebarEntry text={t`Giving parents access`} />
    <SidebarEntry text={t`Curriculum`} />
    <SidebarEntry text={t`Classes`} />
    <SidebarEntry text={t`Pricing & Billing`} />

    <SidebarHeader text={t`Students`} />
    <SidebarEntry text={t`Student profiles`} />
    <SidebarEntry text={t`Guardian profiles`} />
    <SidebarEntry text={t`Sharing data to guardians`} />

    <SidebarHeader text={t`Observations`} />
    <SidebarEntry text={t`Writing observations`} />
    <SidebarEntry text={t`Collaborating with parents`} />

    <SidebarHeader text={t`Lesson Plans`} />
    <SidebarEntry text={t`Creating Lesson plan`} />
    <SidebarEntry text={t`Repetitions`} />
    <SidebarEntry text={t`Sharing with parents`} />

    {/* <SidebarHeader text={t`Billing`} /> */}

    <SidebarHeader text={t`Support`} />
    <SidebarEntry text={t`Giving feedbacks`} />
    <SidebarEntry text={t`Contacting us`} />

    <SidebarHeader text={t`Open source`} />
    <SidebarEntry text={t`Open-source by default`} />
    <SidebarEntry text={t`Contributing`} />
    <SidebarEntry text={t`Self-hosting Obserfy`} />
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
    className="no-underline hover:underline block border-l pl-3 py-1"
  >
    <h5 className="text-gray-700">{text}</h5>
  </Link>
)

export default DocsSidebar
