import { Link } from "react-router-dom";

type BaseProps = {
  icon: string;
  title: string;
  showTitle?: boolean;
  disabled?: boolean;
  variant?: "default" | "danger";
  tooltip?: string;
  className?: string;
};

type ButtonProps = BaseProps & {
  as?: "button";
  onClick: () => void;
};

type LinkProps = BaseProps & {
  as: "link";
  to: string;
};

type Props = ButtonProps | LinkProps;

const iconOnlyClasses =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-transparent bg-white text-stone-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-35";

const withTitleClasses =
  "inline-flex min-h-10 items-center justify-center rounded-lg border-2 border-transparent bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 disabled:opacity-50";

const dangerWithTitleClasses =
  "inline-flex min-h-10 items-center justify-center rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100 disabled:opacity-50";

export function IconButton(props: Props) {
  const baseClasses =
    props.variant === "danger" && props.showTitle
      ? dangerWithTitleClasses
      : props.showTitle
        ? withTitleClasses
        : iconOnlyClasses;

  const className = [
    baseClasses,
    props.className ?? "",
  ].join(" ");

  const iconClassName = props.showTitle
    ? "mr-2 h-4 w-4 shrink-0"
    : "h-3.5 w-3.5";
    
  const content = (
    <>
      <img src={props.icon} alt="" aria-hidden="true" className={iconClassName} />
      {props.showTitle && props.title}
    </>
  );

  if (props.as === "link") {
    return (
      <Link
        to={props.to}
        title={props.tooltip ?? props.title}
        aria-label={props.title}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.tooltip ?? props.title}
      aria-label={props.title}
      className={className}
    >
      {content}
    </button>
  );
}
