import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { HabitDetail } from "./pages/HabitDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/habits/:id" element={<HabitDetail />} />
    </Routes>
  );
}

export default App;
