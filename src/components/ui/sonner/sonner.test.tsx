import * as React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Toaster } from "./sonner"

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}))

describe("Sonner Toaster component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Toaster />)
    expect(container).toBeDefined()
  })
})
