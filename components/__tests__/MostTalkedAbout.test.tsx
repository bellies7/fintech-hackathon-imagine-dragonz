import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MostTalkedAbout from "../MostTalkedAbout"

describe("MostTalkedAbout", () => {
  it("renders the heading", () => {
    render(<MostTalkedAbout />)
    expect(screen.getByText("Most Talked About")).toBeInTheDocument()
  })

  it("shows All region tab as active by default", () => {
    render(<MostTalkedAbout />)
    const allButton = screen.getByRole("button", { name: "All" })
    expect(allButton.className).toContain("bg-primary")
  })

  it("displays article count for the active region", () => {
    render(<MostTalkedAbout />)
    expect(screen.getByText(/Showing \d+ articles in All/)).toBeInTheDocument()
  })

  it("shows topic bars with counts and percentages", () => {
    render(<MostTalkedAbout />)
    const mentionTexts = screen.getAllByText(/mentions/)
    expect(mentionTexts.length).toBeGreaterThan(0)
    expect(mentionTexts.length).toBeLessThanOrEqual(5)
  })

  it("updates when Singapore region is selected", async () => {
    const user = userEvent.setup()
    render(<MostTalkedAbout />)

    await user.click(screen.getByRole("button", { name: "Singapore" }))

    expect(
      screen.getByText(/Showing \d+ articles in Singapore/),
    ).toBeInTheDocument()

    const sgButton = screen.getByRole("button", { name: "Singapore" })
    expect(sgButton.className).toContain("bg-primary")
  })

  it("updates when Asia region is selected", async () => {
    const user = userEvent.setup()
    render(<MostTalkedAbout />)

    await user.click(screen.getByRole("button", { name: "Asia" }))

    expect(
      screen.getByText(/Showing \d+ articles in Asia/),
    ).toBeInTheDocument()
  })

  it("shows at most 5 topic bars", () => {
    render(<MostTalkedAbout />)
    const mentionTexts = screen.getAllByText(/mentions/)
    expect(mentionTexts.length).toBeLessThanOrEqual(5)
  })
})
