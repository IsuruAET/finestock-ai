import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type CheckboxProps<T extends FieldValues> = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "type"
> & {
  value?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: FieldPath<T>;
  control?: Control<T>;
  label?: React.ReactNode;
  error?: string;
};

const Checkbox = <T extends FieldValues>({
  name,
  control,
  label,
  error,
  ...props
}: CheckboxProps<T>) => {
  if (name && control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <CheckboxInner
            {...props}
            checked={field.value ?? false}
            onChange={(e) => field.onChange(e.target.checked)}
            label={label}
            error={fieldState.error?.message || error}
          />
        )}
      />
    );
  }

  return <CheckboxInner {...props} label={label} error={error} />;
};

type CheckboxInnerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  error?: string;
};

const CheckboxInner = ({
  checked = false,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  className = "",
  ...rest
}: CheckboxInnerProps) => {
  return (
    <div>
      <label
        className={`flex items-start gap-3 cursor-pointer ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        } ${className}`}
      >
        <div className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:outline-none focus:ring-blue-500 focus:ring-2 transition-colors ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500"
            } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            {...rest}
          />
        </div>
        {label && (
          <span
            className={`text-sm text-gray-700 ${
              disabled ? "cursor-not-allowed" : ""
            }`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        )}
      </label>
      {error && <p className="text-red-500 text-xs mt-1 ml-7">{error}</p>}
    </div>
  );
};

export default Checkbox;
