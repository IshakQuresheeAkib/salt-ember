import { cleanup } from "@testing-library/react";
import { createElement, type ImgHTMLAttributes } from "react";
import { afterEach, vi } from "vitest";

type TestImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
};

afterEach(() => {
  cleanup();
});

Object.defineProperty(Element.prototype, "scrollIntoView", {
  configurable: true,
  value: vi.fn(),
  writable: true,
});

vi.mock("next/image", () => ({
  default: ({ fill, priority, unoptimized, ...props }: TestImageProps) => {
    void fill;
    void priority;
    void unoptimized;
    return createElement("img", props);
  },
}));
