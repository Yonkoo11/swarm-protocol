import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { TasksPage } from "./pages/TasksPage";
import { MyTasksPage } from "./pages/MyTasksPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { CreateTaskPage } from "./pages/CreateTaskPage";
import { DisputesPage } from "./pages/DisputesPage";
import { JurorPage } from "./pages/JurorPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
          <div className="fade-in">
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/create" element={<CreateTaskPage />} />
              <Route path="/my-tasks" element={<MyTasksPage />} />
              <Route path="/disputes" element={<DisputesPage />} />
              <Route path="/juror" element={<JurorPage />} />
            </Routes>
          </div>
        </main>
        <footer className="w-full mt-auto">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <hr className="rule" />
            <div className="py-6 flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
              <span className="italic">HiveMind Protocol on Base Sepolia</span>
              <span className="tabular-nums">MMXXVI</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
