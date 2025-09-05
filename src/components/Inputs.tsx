import type { ReactNode } from "react";
import { Input } from "./ui/input";
import classNames from "classnames";
import { Label } from "./ui/label";

type Props = {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  placeholder: string;
  name?: string;
  id?: string;
  type?: string;
  label?: string;
  htmlFor?: string;
  requiredLabel?: boolean;
  containerClassName?: string;
  query: string | null;
  handleQueryChange: (query: string) => void;
};

const Inputs: React.FC<Props> = ({
  startIcon,
  endIcon,
  containerClassName,
  name,
  id,
  type,
  label,
  htmlFor,
  placeholder,
  requiredLabel,
  query,
  handleQueryChange,
}) => {
  return (
    <div className={classNames("flex w-full flex-col gap-1", containerClassName)}>
      {label && (
        <Label htmlFor={htmlFor ?? id}>
          <div className="flex items-center gap-1">
            <span>{label}</span>
            {requiredLabel && <span className="text-sidebar-ring">*</span>}
          </div>
        </Label>
      )}

      <div className="relative">
        {startIcon && (
          <span
            className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            {startIcon}
          </span>
        )}

        <Input
          value={query ?? ""}
          onChange={(e) => handleQueryChange(e.target.value)}
          name={name}
          id={id}
          type={type}
          className={classNames(
            "h-12 py-0 rounded-2xl",
            { "pl-16": !!startIcon, "pr-12": !!endIcon },
          )}
          placeholder={placeholder}
        />

        {endIcon && (
          <span
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            {endIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Inputs;
