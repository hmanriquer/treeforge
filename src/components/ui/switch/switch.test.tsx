import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Switch } from "./switch"

describe("Switch component", () => {
  it("renders correctly and can be toggled", () => {
    render(<Switch />)
    const toggle = screen.getByRole("switch")
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveAttribute("aria-checked", "false")
    
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-checked", "true")
  })
})
