import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Navbar } from "@/components/layout/navbar";
import { MarqueeStrip } from "@/components/sections/marquee-strip";

describe("homepage navigation and announcement", () => {
  it("opens mobile navigation and closes after choosing About", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: "Open navigation" }));

    const dialog = screen.getByRole("dialog", { name: "Navigation" });
    expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getByRole("link", { name: "About" }));

    expect(screen.queryByRole("dialog", { name: "Navigation" })).not.toBeInTheDocument();
  });

  it("lets diners pause and resume the announcement strip", async () => {
    const user = userEvent.setup();
    render(<MarqueeStrip />);

    const pauseButton = screen.getByRole("button", { name: "Pause announcement" });
    await user.click(pauseButton);

    expect(screen.getByRole("button", { name: "Resume announcement" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Resume announcement" }));

    expect(screen.getByRole("button", { name: "Pause announcement" })).toBeInTheDocument();
  });
});
