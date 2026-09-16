import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "text";

type ButtonSharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonLinkProps = ButtonSharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonElementProps = ButtonSharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonProps = ButtonLinkProps | ButtonElementProps;

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "gap-[clamp(9px,1.5vw,22px)] bg-orange text-midnight-shadow transition-[transform,scale,background] duration-200 hover:-translate-y-0.5 hover:bg-silver active:scale-[0.97]",
  secondary:
    "border border-orange text-orange transition-colors duration-200 hover:bg-orange hover:text-midnight-shadow",
  text: "p-0 text-orange underline decoration-orange underline-offset-4 transition-colors duration-200 hover:text-orange",
};

const buttonBaseClassName =
  "inline-flex min-h-8 items-center rounded-[11px] px-[clamp(14px,1.5vw,20px)] py-[clamp(10px,0.5vw,13px)] text-[clamp(13px,12px+0.14vw,15px)] font-bold";

function isButtonLink(props: ButtonProps): props is ButtonLinkProps {
  return typeof props.href === "string";
}

function getButtonClassName(variant: ButtonVariant, className?: string) {
  return cn(buttonBaseClassName, buttonVariants[variant], className);
}

export function Button(props: ButtonProps) {
  if (isButtonLink(props)) {
    const { children, className, variant = "primary", ...linkProps } = props;

    return (
      <a {...linkProps} className={getButtonClassName(variant, className)}>
        {children}
      </a>
    );
  }

  const {
    children,
    className,
    type,
    variant = "primary",
    ...buttonProps
  } = props;

  return (
    <button
      {...buttonProps}
      className={getButtonClassName(variant, className)}
      type={type ?? "button"}
    >
      {children}
    </button>
  );
}
