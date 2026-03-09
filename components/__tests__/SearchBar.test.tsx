import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SearchBar from "../SearchBar"
import { getArticles, getDummyArticles } from "@/lib/article-source"

vi.mock("@/lib/article-source", async () => {
  const actual = await vi.importActual<typeof import("@/lib/article-source")>(
    "@/lib/article-source",
  )
  return {
    ...actual,
    getArticles: vi.fn().mockResolvedValue(actual.getDummyArticles()),
  }
})

const mockedGetArticles = vi.mocked(getArticles)

beforeEach(() => {
  mockedGetArticles.mockResolvedValue(getDummyArticles())
})

async function renderAndWait() {
  render(<SearchBar />)
  await waitFor(() => {
    expect(screen.getByText("Search Articles")).toBeInTheDocument()
  })
}

describe("SearchBar", () => {
  it("renders the search heading and subtitle", async () => {
    await renderAndWait()
    expect(screen.getByText("Search Articles")).toBeInTheDocument()
    expect(
      screen.getByText("Type any topic or pick from suggestions below"),
    ).toBeInTheDocument()
  })

  it("shows no results section when no topics are entered", async () => {
    await renderAndWait()
    expect(screen.queryByText(/articles? found/)).not.toBeInTheDocument()
  })

  it("shows suggested topic pills", async () => {
    await renderAndWait()
    expect(screen.getByText("Suggested topics")).toBeInTheDocument()
    expect(screen.getByText("+ Inflation")).toBeInTheDocument()
    expect(screen.getByText("+ Oil")).toBeInTheDocument()
  })

  it("adds an OR topic by typing and pressing Enter", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    const input = screen.getByPlaceholderText("Search for any topic...")
    await user.type(input, "inflation{Enter}")

    await waitFor(() => {
      expect(screen.getByText("1 article found")).toBeInTheDocument()
    })
    expect(screen.getByText("US inflation rises again")).toBeInTheDocument()
  })

  it("adds a topic by clicking a suggestion pill", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    await user.click(screen.getByText("+ Inflation"))

    await waitFor(() => {
      expect(screen.getByText("1 article found")).toBeInTheDocument()
    })
  })

  it("switches to AND mode and narrows results", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    const input = screen.getByPlaceholderText("Search for any topic...")
    await user.type(input, "us{Enter}")

    await waitFor(() => {
      expect(screen.getByText(/articles? found/)).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: "AND" }))
    await user.type(input, "federal-reserve{Enter}")

    await waitFor(() => {
      expect(screen.getByText("1 article found")).toBeInTheDocument()
    })
    expect(
      screen.getByText("Fed hints at interest rate hike"),
    ).toBeInTheDocument()
  })

  it("shows empty state when no articles match", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    const input = screen.getByPlaceholderText("Search for any topic...")
    await user.type(input, "china{Enter}")

    await user.click(screen.getByRole("button", { name: "AND" }))
    await user.type(input, "federal-reserve{Enter}")

    await waitFor(() => {
      expect(
        screen.getByText("No articles match your current filters."),
      ).toBeInTheDocument()
    })
  })

  it("clears all topics when Clear all is clicked", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    const input = screen.getByPlaceholderText("Search for any topic...")
    await user.type(input, "oil{Enter}")

    await waitFor(() => {
      expect(screen.getByText(/articles? found/)).toBeInTheDocument()
    })

    await user.click(screen.getByText("Clear all"))

    await waitFor(() => {
      expect(screen.queryByText(/articles? found/)).not.toBeInTheDocument()
    })
  })

  it("removes an OR topic chip when its close button is clicked", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    const input = screen.getByPlaceholderText("Search for any topic...")
    await user.type(input, "oil{Enter}")

    await waitFor(() => {
      expect(screen.getByText(/articles? found/)).toBeInTheDocument()
    })

    const anyOfLabel = screen.getByText("Any of")
    const filterSection = anyOfLabel.closest("div")!
    const chipButton = filterSection.querySelector("button")!
    await user.click(chipButton)

    await waitFor(() => {
      expect(screen.queryByText(/articles? found/)).not.toBeInTheDocument()
    })
  })

  it("renders article links pointing to the correct url", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    const input = screen.getByPlaceholderText("Search for any topic...")
    await user.type(input, "inflation{Enter}")

    await waitFor(() => {
      expect(screen.getByText("US inflation rises again")).toBeInTheDocument()
    })

    const link = screen.getByText("US inflation rises again").closest("a")
    expect(link).toHaveAttribute("href", "https://example.com/1")
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("filters suggestion pills as user types", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    const input = screen.getByPlaceholderText("Search for any topic...")
    await user.type(input, "inf")

    expect(screen.getByText("+ Inflation")).toBeInTheDocument()
    expect(screen.queryByText("+ Oil")).not.toBeInTheDocument()
    expect(screen.getByText("Matching topics")).toBeInTheDocument()
  })

  it("hides a suggestion pill once it has been selected", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    expect(screen.getByText("+ Oil")).toBeInTheDocument()

    await user.click(screen.getByText("+ Oil"))

    expect(screen.queryByText("+ Oil")).not.toBeInTheDocument()
  })
})
