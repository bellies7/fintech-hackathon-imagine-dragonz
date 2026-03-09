import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SearchBar from "../SearchBar"

describe("SearchBar", () => {
  it("renders the search heading", () => {
    render(<SearchBar />)
    expect(screen.getByText("Search Articles")).toBeInTheDocument()
  })

  it("shows no results section when no topics are entered", () => {
    render(<SearchBar />)
    expect(screen.queryByText(/articles? found/)).not.toBeInTheDocument()
  })

  it("adds an OR topic on Enter and shows results reactively", async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const orInput = screen.getAllByPlaceholderText("Type and press Enter...")[0]
    await user.type(orInput, "inflation{Enter}")

    expect(screen.getByText("1 article found")).toBeInTheDocument()
    expect(screen.getByText("US inflation rises again")).toBeInTheDocument()
  })

  it("adds an AND topic and narrows results", async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const inputs = screen.getAllByPlaceholderText("Type and press Enter...")
    await user.type(inputs[0], "us{Enter}")

    const articleCountBefore = screen.getByText(/articles? found/)
    expect(articleCountBefore).toBeInTheDocument()

    await user.type(inputs[1], "federal-reserve{Enter}")

    expect(screen.getByText("1 article found")).toBeInTheDocument()
    expect(
      screen.getByText("Fed hints at interest rate hike"),
    ).toBeInTheDocument()
  })

  it("shows empty state when no articles match", async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const inputs = screen.getAllByPlaceholderText("Type and press Enter...")
    await user.type(inputs[0], "china{Enter}")
    await user.type(inputs[1], "federal-reserve{Enter}")

    expect(
      screen.getByText("No articles match your current filters."),
    ).toBeInTheDocument()
  })

  it("clears all topics and hides results when Clear is clicked", async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const orInput = screen.getAllByPlaceholderText("Type and press Enter...")[0]
    await user.type(orInput, "oil{Enter}")

    expect(screen.getByText(/articles? found/)).toBeInTheDocument()

    await user.click(screen.getByText("Clear"))

    expect(screen.queryByText(/articles? found/)).not.toBeInTheDocument()
  })

  it("removes an OR topic chip when × is clicked", async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const orInput = screen.getAllByPlaceholderText("Type and press Enter...")[0]
    await user.type(orInput, "oil{Enter}")

    const chips = screen.getAllByText("oil")
    expect(chips.length).toBeGreaterThan(0)

    const removeButton = screen.getAllByText("×")[0]
    await user.click(removeButton)

    expect(screen.queryByText(/articles? found/)).not.toBeInTheDocument()
  })

  it("renders article links pointing to the correct url", async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const orInput = screen.getAllByPlaceholderText("Type and press Enter...")[0]
    await user.type(orInput, "inflation{Enter}")

    const link = screen.getByText("US inflation rises again").closest("a")
    expect(link).toHaveAttribute("href", "https://example.com/1")
    expect(link).toHaveAttribute("target", "_blank")
  })
})
