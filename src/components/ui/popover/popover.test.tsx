import * as React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription } from "./popover"

describe("Popover component", () => {
  it("renders correctly and opens on click", async () => {
    render(
      <Popover>
        <PopoverTrigger>Toggle Popover</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Desc</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    )

    expect(screen.queryByText("Title")).toBeNull()

    fireEvent.click(screen.getByText("Toggle Popover"))

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument()
      expect(screen.getByText("Desc")).toBeInTheDocument()
    })
  })
})
