import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select"

describe("Select component", () => {
  it("renders and displays trigger text", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText("Choose an option")).toBeInTheDocument()
  })
})
