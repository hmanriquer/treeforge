import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card"

describe("Card component", () => {
  it("renders all card subcomponents correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText(/card title/i)).toBeInTheDocument()
    expect(screen.getByText(/card description/i)).toBeInTheDocument()
    expect(screen.getByText(/card content/i)).toBeInTheDocument()
    expect(screen.getByText(/card footer/i)).toBeInTheDocument()
  })

  it("applies custom className to parts", () => {
    const { container } = render(<Card className="custom-card" />)
    const card = container.querySelector('[data-slot="card"]')
    expect(card).toHaveClass("custom-card")
  })
})
