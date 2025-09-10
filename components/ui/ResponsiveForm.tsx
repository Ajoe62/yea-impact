"use client";

import React, { useState } from "react";

type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
  touched?: boolean;
  containerClassName?: string;
  labelClassName?: string;
};

type SelectProps = React.ComponentPropsWithoutRef<"select"> & {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  touched?: boolean;
  containerClassName?: string;
  labelClassName?: string;
};

type TextAreaProps = React.ComponentPropsWithoutRef<"textarea"> & {
  label: string;
  error?: string;
  touched?: boolean;
  containerClassName?: string;
  labelClassName?: string;
};

export function ResponsiveInput({
  label,
  id,
  error,
  touched,
  containerClassName = "",
  labelClassName = "",
  className = "",
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const showError = error && touched;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label
        htmlFor={id}
        className={`block mb-1 font-medium text-sm text-gray-700 ${labelClassName}`}
      >
        {label}
      </label>
      <input
        id={id}
        className={`
          w-full px-3 py-2 text-base leading-6 rounded-md 
          ${
            showError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-green-500 focus:ring-green-500"
          }
          shadow-sm focus:outline-none focus:ring-1 transition duration-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {showError && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function ResponsiveSelect({
  label,
  id,
  options,
  error,
  touched,
  containerClassName = "",
  labelClassName = "",
  className = "",
  ...props
}: SelectProps) {
  const [focused, setFocused] = useState(false);
  const showError = error && touched;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label
        htmlFor={id}
        className={`block mb-1 font-medium text-sm text-gray-700 ${labelClassName}`}
      >
        {label}
      </label>
      <select
        id={id}
        className={`
          w-full px-3 py-2 text-base leading-6 rounded-md appearance-none
          ${
            showError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-green-500 focus:ring-green-500"
          }
          shadow-sm focus:outline-none focus:ring-1 transition duration-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showError && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function ResponsiveTextarea({
  label,
  id,
  error,
  touched,
  containerClassName = "",
  labelClassName = "",
  className = "",
  ...props
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  const showError = error && touched;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label
        htmlFor={id}
        className={`block mb-1 font-medium text-sm text-gray-700 ${labelClassName}`}
      >
        {label}
      </label>
      <textarea
        id={id}
        className={`
          w-full px-3 py-2 text-base leading-6 rounded-md 
          ${
            showError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-green-500 focus:ring-green-500"
          }
          shadow-sm focus:outline-none focus:ring-1 transition duration-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {showError && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function ResponsiveForm({
  children,
  className = "",
  onSubmit,
}: {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form
      className={`space-y-4 ${className}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {children}
    </form>
  );
}

export function ResponsiveButton({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
    outline:
      "bg-white text-green-600 border border-green-600 hover:bg-green-50 focus:ring-green-500",
    text: "bg-transparent text-green-600 hover:bg-green-50 focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${width}
        ${isLoading ? "opacity-80 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
