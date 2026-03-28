import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Spinner } from "./spinner"

describe("Spinner component", () => {
  it("renders correctly", () => {
    render(<Spinner />)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })
})
