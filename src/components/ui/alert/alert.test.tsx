import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Alert, AlertTitle, AlertDescription } from "./alert"
import { Info } from "lucide-react"

describe("Alert component", () => {
  it("renders with title and description", () => {
    render(
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>This is a test alert.</AlertDescription>
      </Alert>
    )
    expect(screen.getByText(/heads up!/i)).toBeInTheDocument()
    expect(screen.getByText(/this is a test alert/i)).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })

  it("applies variant styles correctly", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
      </Alert>
    )
    const alert = screen.getByRole("alert")
    expect(alert).toHaveClass("text-destructive")
  })
})
