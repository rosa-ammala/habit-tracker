import { HabitsProvider } from "./context/HabitsProvider";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <HabitsProvider>
      <Home />
    </HabitsProvider>
  );
}