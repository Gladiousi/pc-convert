import { ButtonHTMLAttributes, ReactNode } from "react";

interface TabSelectorProps<T extends string> {
  tabs: { value: T; label: string }[];
  activeTab: T;
  setTab: (tab: T) => void;
}

interface SelectProps {
    label: string;
    value: string | undefined;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    className?: string;
    ariaLabel?: string;
}

interface MultiSelectProps {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
    options: string[];
    placeholder?: string;
    className?: string;
    ariaLabel?: string;
}

interface SectionHeadingProps {
    children: string;
    className?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: string;
}

interface ErrorListProps {
  errors: string[];
  className?: string;
}

interface PageContainerProps {
    children: ReactNode;
    className?: string;
    minHeight?: string;
}

interface AlertProps {
  type: "error" | "success";
  message: string | null;
  className?: string;
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export type {TabSelectorProps, SelectProps, MultiSelectProps, SectionHeadingProps, PageContainerProps, GradientButtonProps, ErrorListProps, AlertProps, CardProps}