import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Toggle } from "./toggle"

describe("Toggle component", () => {
  it("renders and toggles correctly", () => {
    render(<Toggle aria-label="Toggle italic">I</Toggle>)
    const button = screen.getByLabelText("Toggle italic")
    
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute("aria-pressed", "false")
    
    fireEvent.click(button)
    expect(button).toHaveAttribute("aria-pressed", "true")
  })
})
