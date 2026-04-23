const BASE_URL = "http://localhost:3000/api";

export async function getHabits() {
  const res = await fetch(`${BASE_URL}/habits`);
  return res.json();
}

export async function createHabit(data: {
  title: string;
  categoryId: number;
}) {
  const res = await fetch(`${BASE_URL}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateHabit(
  id: number,
  data: { title: string; categoryId: number }
) {
  const res = await fetch(`${BASE_URL}/habits/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteHabit(id: number) {
  await fetch(`${BASE_URL}/habits/${id}`, {
    method: "DELETE",
  });
}

export async function toggleHabitLog(
  habitId: number,
  date: string,
  isChecked: boolean
) {
  const method = isChecked ? "DELETE" : "POST";

  await fetch(`${BASE_URL}/habits/${habitId}/log`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date }),
  });
}