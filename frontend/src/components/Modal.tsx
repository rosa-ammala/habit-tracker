type Props = {
  title: string;
  isCloseDisabled?: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({
  title,
  children,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border-2 border-transparent bg-white p-5 shadow-xl shadow-stone-950/15">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-stone-950">
            {title}
          </h2>
        </div>

        {children}
      </div>
    </div>
  );
}
