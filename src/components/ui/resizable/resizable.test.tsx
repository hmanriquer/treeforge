import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable"

describe("Resizable component", () => {
  it("renders the resizable panel group correctly", () => {
    const { container } = render(
      // @ts-ignore - The types on ResizablePanelGroup don't explicitly list direction
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>Panel 1</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>Panel 2</ResizablePanel>
      </ResizablePanelGroup>
    )

    // Data attributes like data-testid get overridden by react-resizable-panels, 
    // so we verify by querying the text and DOM directly
    expect(screen.getByText("Panel 1")).toBeInTheDocument()
    expect(screen.getByText("Panel 2")).toBeInTheDocument()
    expect(container.querySelector('[data-slot="resizable-panel-group"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="resizable-handle"]')).toBeInTheDocument()
  })
})
