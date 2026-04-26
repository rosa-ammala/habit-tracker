import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HabitsProvider } from "./context/HabitsProvider";
import { HabitDetail } from "./pages/HabitDetail";
import { Home } from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/habit/:id",
    element: <HabitDetail />,
  },
]);

export default function App() {
  return (
    <HabitsProvider>
      <RouterProvider router={router} />
    </HabitsProvider>
  );
}