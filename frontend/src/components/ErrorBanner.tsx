type Props = {
  message: string;
};

export function ErrorBanner({ message }: Props) {
  return (
    <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
      <p role="alert">{message}</p>
    </div>
  );
}
