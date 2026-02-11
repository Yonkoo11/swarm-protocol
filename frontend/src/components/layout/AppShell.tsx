import { useState, useCallback } from "react";
import { Header } from "./Header";
import { StatsRibbon } from "./StatsRibbon";
import { TabBar, type TabId } from "./TabBar";
import { BottomSheet } from "../common/BottomSheet";
import { FeedTab } from "../tabs/FeedTab";
import { PostTab } from "../tabs/PostTab";
import { MineTab } from "../tabs/MineTab";
import { JuryTab } from "../tabs/JuryTab";
import { TaskDetail } from "../tasks/TaskDetail";
import type { Task } from "../../lib/types";

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>("feed");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTabChange = useCallback((newTab: TabId) => {
    setActiveTab(newTab);
  }, []);

  const handleSelectTask = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedTask(null);
  }, []);

  return (
    <div className="app-shell">
      <Header />
      <StatsRibbon />

      <div className="content-area">
        {activeTab === "feed" && <FeedTab onSelectTask={handleSelectTask} />}
        {activeTab === "post" && <PostTab />}
        {activeTab === "mine" && <MineTab onSelectTask={handleSelectTask} />}
        {activeTab === "jury" && <JuryTab />}
      </div>

      <BottomSheet open={selectedTask !== null} onClose={handleCloseSheet}>
        {selectedTask && <TaskDetail task={selectedTask} onClose={handleCloseSheet} />}
      </BottomSheet>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
