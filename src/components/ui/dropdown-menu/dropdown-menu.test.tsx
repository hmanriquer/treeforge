import * as React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown-menu"

// Mock ResizeObserver for Radix Popper
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("DropdownMenu component", () => {
  it("opens the menu when clicking the trigger", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByText(/open menu/i)
    fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false })

    await waitFor(() => {
      expect(screen.getByText(/my account/i)).toBeInTheDocument()
      expect(screen.getByText(/profile/i)).toBeInTheDocument()
    })
  })
})
