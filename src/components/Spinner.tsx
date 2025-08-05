import MoonLoader from "react-spinners/MoonLoader";
import { useTheme } from "next-themes";

type SpinnerProps = {
  size?: number;
  loading?: boolean;
  className?: string;
};

export const Spinner = ({ size = 40, loading = true, className }: SpinnerProps) => {
  const { theme } = useTheme();

  return (
    <MoonLoader
      loading={loading}
      size={size}
      color={theme === "dark" ? "white" : "black"}
      className={className}
    />
  );
};

