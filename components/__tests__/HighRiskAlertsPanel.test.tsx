import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import HighRiskAlertsPanel from "../HighRiskAlertsPanel"

describe("HighRiskAlertsPanel", () => {
  it("renders the heading and summary", () => {
    render(<HighRiskAlertsPanel />)
    expect(screen.getByText("High Risk Alerts")).toBeInTheDocument()
    expect(
      screen.getByText(/Top \d+ “Hot” macro risks from your watchlist/),
    ).toBeInTheDocument()
  })

  it("renders at least one region summary chip", () => {
    render(<HighRiskAlertsPanel />)
    const chips = screen.getAllByText(/· \d+/, { exact: false })
    expect(chips.length).toBeGreaterThan(0)
  })

  it("renders up to 3 high risk articles with details", () => {
    render(<HighRiskAlertsPanel />)

    // Titles of first three Hot articles in mock-data
    expect(
      screen.getByText("Fed Holds Rates Steady Amid Inflation Concerns"),
    ).toBeInTheDocument()
    expect(
      screen.getByText("Oil Prices Surge on OPEC+ Production Cut Extension"),
    ).toBeInTheDocument()
    expect(
      screen.getByText("Federal Reserve Minutes Reveal Split on Rate Path"),
    ).toBeInTheDocument()
  })

  it("opens a detail panel when an alert is clicked", async () => {
    const user = userEvent.setup()
    render(<HighRiskAlertsPanel />)

    const alertTitle = screen.getByText(
      "Fed Holds Rates Steady Amid Inflation Concerns",
    )
    await user.click(alertTitle)

    expect(screen.getByText("News Detail")).toBeInTheDocument()
    expect(
      screen.getByText("Risk Implication", { exact: false }),
    ).toBeInTheDocument()
  })
})

