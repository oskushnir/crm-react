import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import type { MultiValue, StylesConfig } from "react-select";
import type { Option } from "@/types/Option";
import { useTheme } from "next-themes";

const animatedComponents = makeAnimated();

export default function Combobox({
  value,
  onChange,
  placeHolder,
  name,
}: {
  value: string;
  onChange: (field: string, value: string) => void;
  placeHolder: string;
  name: string;
}) {
  const { theme } = useTheme();

  const options: Option[] = value
    ? value.split(",").map((item) => ({
        label: item.trim(),
        value: item.trim(),
      }))
    : [];

  const handleChange = (selected: MultiValue<Option>) => {
    const joined = selected.map((opt) => opt.value).join(", ");
    onChange(name, joined);
  };

  const customStyles: StylesConfig<Option, true> = {
    control: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "var(--sidebar)" : "white",
      borderColor: theme === "dark" ? "var(--border)" : "#ccc",
      color: theme === "dark" ? "var(--sidebar-foreground)" : "black",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "var(--sidebar)" : "white",
      color: theme === "dark" ? "var(--sidebar-foreground)" : "black",
    }),
    input: (base) => ({
      ...base,
      color: theme === "dark" ? "var(--sidebar-foreground)" : "black",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#444" : "#e2e8f0",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: theme === "dark" ? "white" : "black",
    }),
    placeholder: (base) => ({
      ...base,
      color: theme === "dark" ? "#aaa" : "#666",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme === "dark"
          ? "#555"
          : "#f0f0f0"
        : "transparent",
      color: theme === "dark" ? "white" : "black",
    }),
  };

  return (
    <CreatableSelect
      isMulti
      components={{ ...animatedComponents, DropdownIndicator: null }}
      placeholder={`Enter ${placeHolder}`}
      blurInputOnSelect={false}
      closeMenuOnSelect={false}
      value={options}
      onChange={handleChange}
      noOptionsMessage={() => null}
      formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
      name={name}
      styles={customStyles}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    />
  );
}
