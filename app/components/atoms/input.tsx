import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  variant?: "default" | "floating";
  label?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", label, id, ...props }, ref) => {
    if (variant === "floating") {
      const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
      return (
        <div className="relative w-full">
          <input
            ref={ref}
            id={inputId}
            type={type}
            placeholder=" "
            className={cn(
              "peer block w-full rounded-md border border-gray-300 bg-transparent px-2 pt-2 pb-1 text-sm shadow-sm",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "absolute left-2 text-gray-500 text-xs transition-all bg-white px-1",
                // Default (floating)
                "peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400",
                // When focused OR has value (not placeholder-shown)
                "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600",
                "peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-600"
              )}
            >
              {label}
            </label>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        id={id}
        type={type}
        className={cn(
          "block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

type TextareaProps = React.ComponentProps<"textarea"> & {
  variant?: "default" | "floating";
  label?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", label, id, ...props }, ref) => {
    if (variant === "floating") {
      const textareaId =
        id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`;
      return (
        <div className="relative w-full">
          <textarea
            ref={ref}
            id={textareaId}
            placeholder=" "
            className={cn(
              "peer block w-full rounded-md border border-gray-300 bg-transparent px-2 pt-2 pb-2 text-sm shadow-sm",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={textareaId}
              className={cn(
                "absolute left-2 text-gray-500 text-xs transition-all bg-white px-1",
                "peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400",
                "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600",
                "peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-gray-600"
              )}
            >
              {label}
            </label>
          )}
        </div>
      );
    }

    return (
      <textarea
        ref={ref}
        id={id}
        className={cn(
          "block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
