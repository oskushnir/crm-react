import { useTheme } from "next-themes";
import { toast } from "sonner";
import successIcon from "@/../public/icons/success-icon.svg";
import errorIcon from "@/../public/icons/error-icon.svg";

export function usePushMessage() {
  const { theme } = useTheme();

  return ({
    success = true,
    title = "Notification",
    description = "This is a notification message",
  }: {
    success?: boolean;
    title?: string;
    description?: string;
  }) => {
    const icon = (
      <div className="w-7 h-7">
        <img
          src={success ? successIcon : errorIcon}
          alt="Status"
          className="w-full h-full object-contain block"
        />
      </div>
    );

    const backgroundColor =
      theme === "dark" ? "var(--sidebar-foreground)" : "var(--primary-foreground)";
    const border = theme === "dark" ? "none" : ""

    toast(title, {
      icon,
      description,
      style: {
        backgroundColor,
        border,
        fontSize: "1rem",
        gap: "20px",
      },
    });
  };
}

