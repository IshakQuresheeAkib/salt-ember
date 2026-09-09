import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("homepage contract", () => {
  it("renders every approved section and primary action", () => {
    const { container } = render(<Home />);

    for (const id of [
      "top",
      "about",
      "menu",
      "gallery",
      "reservations",
      "contact",
    ]) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
    }

    expect(
      screen.getByRole("heading", { level: 1, name: "Flavour meets fire." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the menu" })).toHaveAttribute(
      "href",
      "#menu",
    );
    expect(screen.getAllByRole("link", { name: "Reserve a table" })[0]).toHaveAttribute(
      "href",
      "#reservations",
    );
  });

  it("renders the approved section headings", () => {
    render(<Home />);

    for (const heading of [
      "From the fire.",
      "Heat is only the beginning.",
      "The Salt & Ember menu.",
      "Around the table.",
      "Guests, in their own words.",
      "Your table is waiting.",
      "Find us in Sylhet.",
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
  });

  it("does not expose ecommerce language", () => {
    const { container } = render(<Home />);

    expect(container).not.toHaveTextContent(/order now|cart|shop|delivery|favourite/i);
  });
});
