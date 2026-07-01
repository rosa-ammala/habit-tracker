type Props = {
  title: string;
  isCloseDisabled?: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({
  title,
  isCloseDisabled = false,
  onClose,
  children,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-gray-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isCloseDisabled}
            className="rounded-md bg-white px-2 py-1 text-sm text-gray-600 ring-1 ring-gray-200 disabled:opacity-50"
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
