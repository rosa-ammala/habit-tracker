type Props = {
  icon: string;
  onClick: () => void;
  size?: "sm" | "md";
  disabled?: boolean;
  hasLeftPadding?: boolean;
  className?: string;
};

export function IconButton({
  icon,
  onClick,
  size = "md",
  disabled = false,
  hasLeftPadding = false,
  className = "",
}: Props) {
  const sizeClasses =
    size === "sm" ? "w-7 h-7" : "w-8 h-8";

  const iconSize =
    size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses} flex items-center justify-center rounded-full transition
        ${disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-white"}
        ${hasLeftPadding ? "pl-1" : ""}
        ${className ?? ""}
      `}
    >
      <img src={icon} className={iconSize} />
    </button>
  );
}