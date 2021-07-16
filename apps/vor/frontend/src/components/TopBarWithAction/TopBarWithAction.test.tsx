import { render } from "../../test-utils"
import TopBarWithAction from "./TopBarWithAction"

describe("TopBarWithAction", () => {
  it("should render correctly", () => {
    const { container } = render(
      <TopBarWithAction
        breadcrumbs={[
          {
            text: "Test",
            to: "/",
          },
        ]}
        onActionClick={() => {}}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
