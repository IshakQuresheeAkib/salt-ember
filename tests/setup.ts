import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { createElement, type ImgHTMLAttributes } from "react";
import { afterEach, vi } from "vitest";

type TestImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  preload?: boolean;
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

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: vi.fn((query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
});

vi.mock("next/image", () => ({
  default: ({ fill, preload, priority, unoptimized, ...props }: TestImageProps) => {
    void fill;
    void preload;
    void priority;
    void unoptimized;
    return createElement("img", props);
  },
}));
