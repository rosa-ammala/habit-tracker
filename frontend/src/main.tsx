import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { HabitDetail } from "./pages/HabitDetail";
import './index.css'
import { HabitsProvider } from "./context/HabitsProvider";

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HabitsProvider>
    <RouterProvider router={router} />
  </HabitsProvider>
);