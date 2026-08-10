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
  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isCloseDisabled) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-md rounded-xl border-2 border-transparent bg-white p-5 shadow-xl shadow-stone-950/15"
      >
        <div className="mb-4">
          <h2 id="modal-title" className="text-lg font-semibold text-stone-950">
            {title}
          </h2>
        </div>

        {children}
      </div>
    </div>
  );
}
