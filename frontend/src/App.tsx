import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { TasksPage } from "./pages/TasksPage";
import { MyTasksPage } from "./pages/MyTasksPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { CreateTaskPage } from "./pages/CreateTaskPage";
import { DisputesPage } from "./pages/DisputesPage";
import { JurorPage } from "./pages/JurorPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/create" element={<CreateTaskPage />} />
              <Route path="/my-tasks" element={<MyTasksPage />} />
              <Route path="/disputes" element={<DisputesPage />} />
              <Route path="/juror" element={<JurorPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
