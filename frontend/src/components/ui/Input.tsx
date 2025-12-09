import { useState, useRef, useEffect, forwardRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type InputProps<T extends FieldValues> = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name"
> & {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  name?: FieldPath<T>;
  control?: Control<T>;
  icon?: React.ReactNode;
};

const Input = <T extends FieldValues>({
  name,
  control,
  ...props
}: InputProps<T>) => {
  if (name && control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <InputInner
            {...props}
            value={field.value ?? ""}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    );
  }

  return <InputInner {...props} />;
};

type InputInnerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name"
> & {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
};

const InputInner = forwardRef<HTMLInputElement, InputInnerProps>(
  (
    {
      value,
      onChange,
      placeholder,
      label,
      type = "text",
      required = false,
      disabled = false,
      error,
      icon,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isPassword = type === "password";
    const isNumber = type === "number";

    // Combine forwarded ref with internal ref
    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    useEffect(() => {
      if (!isNumber) return;

      const input = inputRef.current;
      if (!input) return;

      const handleWheel = (e: WheelEvent) => {
        if (document.activeElement === input) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      input.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        input.removeEventListener("wheel", handleWheel);
      };
    }, [isNumber]);

    const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
      if (isNumber) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleNumberKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }
    };

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div>
        {label && (
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-10">
              {icon}
            </div>
          )}
          <input
            ref={setRefs}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            className={`w-full py-2.5 border rounded-lg outline-none transition-colors leading-normal ${
              icon ? "pl-10 pr-4" : "px-4"
            } ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${
              isNumber
                ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                : ""
            }`}
            value={value}
            onChange={onChange}
            onWheel={isNumber ? handleWheel : undefined}
            onKeyDown={isNumber ? handleNumberKeyDown : undefined}
            disabled={disabled}
            required={required}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <FaRegEyeSlash size={20} />
              ) : (
                <FaRegEye size={20} />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

InputInner.displayName = "InputInner";

export default Input;
