type Props = {
  habitTitle: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function DeleteHabitModal({ habitTitle, onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-5">
        <h2 className="text-lg font-semibold">Delete Habit</h2>

        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{habitTitle}</span>?
        </p>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}