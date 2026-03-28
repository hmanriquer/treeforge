import * as React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog"

describe("Dialog component", () => {
  it("opens the dialog when clicking the trigger", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    fireEvent.click(screen.getByText(/open dialog/i))

    await waitFor(() => {
      expect(screen.getByText(/dialog title/i)).toBeInTheDocument()
      expect(screen.getByText(/dialog description/i)).toBeInTheDocument()
    })
  })
})
