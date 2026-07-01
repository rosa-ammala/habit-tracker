import { useAppDispatch } from "../app/hooks";
import { closeCreateHabitModal } from "../features/ui/uiSlice";
import { useCreateHabitMutation } from "../features/habits/habitsApi";
import type { Category } from "../types/category";
import { HabitFormModal } from "./HabitFormModal";

type Props = {
  categories: Category[];
};

export function CreateHabitModal({ categories }: Props) {
  const dispatch = useAppDispatch();

  const [createHabit, { isLoading, isError }] = useCreateHabitMutation();

  function handleClose() {
    dispatch(closeCreateHabitModal());
  }

  async function handleSubmit(data: { title: string; categoryId: number }) {
    await createHabit(data).unwrap();
    dispatch(closeCreateHabitModal());
  }

  return (
    <HabitFormModal
      title="Create habit"
      submitLabel="Create"
      categories={categories}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Could not create habit."
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
}
