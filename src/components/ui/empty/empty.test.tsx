import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Empty, EmptyTitle, EmptyDescription, EmptyMedia } from "./empty"
import { Search } from "lucide-react"

describe("Empty component", () => {
  it("renders correctly with full structure", () => {
    render(
      <Empty>
        <EmptyMedia>
            <Search />
        </EmptyMedia>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>Try searching for something else.</EmptyDescription>
        <div>Clear search</div>
      </Empty>
    )

    expect(screen.getByText(/no results/i)).toBeInTheDocument()
    expect(screen.getByText(/try searching/i)).toBeInTheDocument()
    expect(screen.getByText(/clear search/i)).toBeInTheDocument()
    expect(screen.queryByTestId("empty")).toBeNull() // Using built testing functions properly
  })
})

// Quick helper
const getByAttribute = (attr: string, value: string) => {
    return document.querySelector(`[${attr}="${value}"]`)
}
