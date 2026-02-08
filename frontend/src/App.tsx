import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { TasksPage } from "./pages/TasksPage";
import { MyTasksPage } from "./pages/MyTasksPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { CreateTaskPage } from "./pages/CreateTaskPage";
import { DisputesPage } from "./pages/DisputesPage";
import { JurorPage } from "./pages/JurorPage";
import { SWARM_COORDINATOR_ADDRESS } from "./lib/constants";
import { truncateAddress } from "./lib/formatters";

const footerLinks = [
  { to: "/tasks", label: "Marketplace" },
  { to: "/create", label: "Post Task" },
  { to: "/my-tasks", label: "My Tasks" },
  { to: "/disputes", label: "Disputes" },
  { to: "/juror", label: "Juror Pool" },
];

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
            <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start text-[12px]">
              {/* Left: Brand */}
              <div className="flex flex-col gap-1">
                <span className="font-serif text-lg font-bold text-[var(--text-primary)] leading-none">
                  HiveMind
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)]">
                  Decentralised task protocol on Base
                </span>
              </div>

              {/* Center: Navigation */}
              <div className="flex items-center justify-center gap-0 flex-wrap">
                {footerLinks.map((link, i) => (
                  <span key={link.to} className="flex items-center">
                    {i > 0 && (
                      <span className="text-[var(--text-tertiary)] mx-1.5 select-none">&middot;</span>
                    )}
                    <Link
                      to={link.to}
                      className="text-[var(--text-tertiary)] no-underline hover:text-[var(--text-primary)] text-[12px]"
                    >
                      {link.label}
                    </Link>
                  </span>
                ))}
              </div>

              {/* Right: Contract */}
              <div className="flex flex-col items-start md:items-end gap-1">
                <span className="section-label text-[10px] tracking-[0.08em]">Contract</span>
                <a
                  href={`https://sepolia.basescan.org/address/${SWARM_COORDINATOR_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[var(--text-tertiary)] no-underline hover:text-[var(--text-primary)]"
                >
                  {truncateAddress(SWARM_COORDINATOR_ADDRESS)}
                </a>
              </div>
            </div>
            <hr className="rule" />
            <div className="py-4 flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
              <span className="tracking-[0.15em] tabular-nums">MMXXVI</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Yonkoo11/swarm-protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-tertiary)] no-underline hover:text-[var(--text-primary)]"
                >
                  GitHub
                </a>
                <span className="select-none">&middot;</span>
                <a
                  href="https://www.moltbook.com/u/TheHiveMind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-tertiary)] no-underline hover:text-[var(--text-primary)]"
                >
                  Moltbook
                </a>
                <span className="select-none">&middot;</span>
                <a
                  href="https://base-sepolia.blockscout.com/address/0xec8419C9F4509d5e83E4329721cFCb9f27f6B649"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-tertiary)] no-underline hover:text-[var(--text-primary)]"
                >
                  Blockscout
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
