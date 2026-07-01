import { useAppDispatch } from "../app/hooks";
import { useUpdateHabitMutation } from "../features/habits/habitsApi";
import { closeEditHabitModal } from "../features/ui/uiSlice";
import type { Category } from "../types/category";
import type { Habit } from "../types/habit";
import { HabitFormModal } from "./HabitFormModal";

type Props = {
  habit: Habit;
  categories: Category[];
};

export function EditHabitModal({ habit, categories }: Props) {
  const dispatch = useAppDispatch();

  const [updateHabit, { isLoading, isError }] = useUpdateHabitMutation();

  function handleClose() {
    dispatch(closeEditHabitModal());
  }

  async function handleSubmit(data: { title: string; categoryId: number }) {
    await updateHabit({
      habitId: habit.id,
      title: data.title,
      categoryId: data.categoryId,
    }).unwrap();

    dispatch(closeEditHabitModal());
  }

  return (
    <HabitFormModal
      title="Edit habit"
      submitLabel="Save"
      categories={categories}
      initialTitle={habit.title}
      initialCategoryId={habit.categoryId}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Could not update habit."
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
}
