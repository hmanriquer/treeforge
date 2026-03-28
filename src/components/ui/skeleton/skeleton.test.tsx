import * as React from "react"
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Skeleton } from "./skeleton"

describe("Skeleton component", () => {
  it("renders correctly", () => {
    const { container } = render(<Skeleton className="w-10 h-10" />)
    expect(container.firstChild).toHaveClass("animate-pulse")
  })
})
