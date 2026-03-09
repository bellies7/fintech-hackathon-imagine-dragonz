import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MostTalkedAbout from "../MostTalkedAbout"
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
  render(<MostTalkedAbout />)
  await waitFor(() => {
    expect(screen.getByText(/Showing \d+ articles/)).toBeInTheDocument()
  })
}

describe("MostTalkedAbout", () => {
  it("renders the heading", async () => {
    await renderAndWait()
    expect(screen.getByText("Most Talked About")).toBeInTheDocument()
  })

  it("shows All region tab as active by default", async () => {
    await renderAndWait()
    const allButton = screen.getByRole("button", { name: "All" })
    expect(allButton.className).toContain("bg-primary")
  })

  it("displays article count for the active region", async () => {
    await renderAndWait()
    expect(screen.getByText(/Showing \d+ articles in All/)).toBeInTheDocument()
  })

  it("shows topic bars with counts and percentages", async () => {
    await renderAndWait()
    const mentionTexts = screen.getAllByText(/mentions/)
    expect(mentionTexts.length).toBeGreaterThan(0)
    expect(mentionTexts.length).toBeLessThanOrEqual(5)
  })

  it("updates when Singapore region is selected", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    await user.click(screen.getByRole("button", { name: "Singapore" }))

    await waitFor(() => {
      expect(
        screen.getByText(/Showing \d+ articles in Singapore/),
      ).toBeInTheDocument()
    })

    const sgButton = screen.getByRole("button", { name: "Singapore" })
    expect(sgButton.className).toContain("bg-primary")
  })

  it("updates when Asia region is selected", async () => {
    const user = userEvent.setup()
    await renderAndWait()

    await user.click(screen.getByRole("button", { name: "Asia" }))

    await waitFor(() => {
      expect(
        screen.getByText(/Showing \d+ articles in Asia/),
      ).toBeInTheDocument()
    })
  })

  it("shows at most 5 topic bars", async () => {
    await renderAndWait()
    const mentionTexts = screen.getAllByText(/mentions/)
    expect(mentionTexts.length).toBeLessThanOrEqual(5)
  })
})
