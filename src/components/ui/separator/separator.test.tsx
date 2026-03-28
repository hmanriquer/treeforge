import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Separator } from "./separator"

describe("Separator component", () => {
  it("renders correctly with default horizontal orientation", () => {
    render(<Separator data-testid="sep" />)
    const el = screen.getByTestId("sep")
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute("data-orientation", "horizontal")
  })
})
