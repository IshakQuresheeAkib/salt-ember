import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("presents each menu dish as a labelled information card", () => {
    render(<Home />);

    const menu = screen.getByRole("region", { name: "The Salt & Ember menu." });
    const emberChicken = within(menu).getByRole("article", { name: "Ember Chicken" });

    expect(
      within(emberChicken).getByRole("img", {
        name: "Char-grilled chicken served with herbs and roasted vegetables",
      }),
    ).toBeInTheDocument();
    expect(within(emberChicken).getByLabelText("Price 780 Bangladeshi taka")).toBeInTheDocument();
    expect(within(emberChicken).getByText("Spice 2 of 3")).toBeInTheDocument();
    expect(within(emberChicken).getByText("halal")).toBeInTheDocument();
    expect(within(emberChicken).getByText("spicy")).toBeInTheDocument();
    expect(within(emberChicken).queryByRole("button")).not.toBeInTheDocument();
    expect(within(emberChicken).queryByRole("link")).not.toBeInTheDocument();
  });

  it("reuses the menu card design for signature dishes", () => {
    render(<Home />);

    const signatureDishes = screen.getByRole("region", { name: "From the fire." });
    const emberChicken = within(signatureDishes).getByRole("article", {
      name: "Ember Chicken",
    });

    expect(emberChicken).toHaveClass("menu-card");
    expect(
      within(emberChicken).getByRole("img", {
        name: "Char-grilled chicken served with herbs and roasted vegetables",
      }),
    ).toBeInTheDocument();
    expect(within(emberChicken).getByLabelText("Price 780 Bangladeshi taka")).toBeInTheDocument();
    expect(within(emberChicken).getByText("Spice 2 of 3")).toBeInTheDocument();
    expect(within(emberChicken).getByText("halal")).toBeInTheDocument();
    expect(within(emberChicken).getByText("spicy")).toBeInTheDocument();
  });

  it("presents several kinds of food in the hero orbit", () => {
    render(<Home />);

    const orbit = screen.getByRole("figure", {
      name: "A rotating selection of Salt & Ember dishes",
    });
    const dishes = within(orbit).getAllByRole("listitem");

    expect(dishes.length).toBeGreaterThanOrEqual(4);
    expect(within(orbit).getByText("Grill")).toBeInTheDocument();
    expect(within(orbit).getByText("Plant-led")).toBeInTheDocument();
    expect(within(orbit).getByText("Dessert")).toBeInTheDocument();
    expect(within(orbit).getByText("Drinks")).toBeInTheDocument();
  });

  it("lets diners pause and resume the hero orbit", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const pauseButton = screen.getByRole("button", { name: "Pause food orbit" });
    const orbit = screen.getByRole("figure", {
      name: "A rotating selection of Salt & Ember dishes",
    });

    await user.click(pauseButton);

    expect(orbit).toHaveAttribute("data-paused", "true");
    expect(screen.getByRole("button", { name: "Resume food orbit" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Resume food orbit" }));

    expect(orbit).toHaveAttribute("data-paused", "false");
    expect(screen.getByRole("button", { name: "Pause food orbit" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("does not expose ecommerce language", () => {
    const { container } = render(<Home />);

    expect(container).not.toHaveTextContent(/order now|cart|shop|delivery|favourite/i);
  });
});
