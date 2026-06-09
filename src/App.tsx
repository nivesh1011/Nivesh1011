/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, Users, Settings, ClipboardList, LogOut, X,
  Map, MessageSquare, Menu, BookOpen, AlertCircle
} from "lucide-react";

// Types & Config
import {
  UserProfile, Task, Lead, Integration, ActiveAlert, SyncLog, RecentBrief, EngineParams,
  ActiveTab, AuthScreen
} from "./types";

// Page modules
import Splash from "./components/Splash";
import SkeletonLoader from "./components/SkeletonLoader";
import AuthPages from "./components/AuthPages";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LeadsHub from "./components/LeadsHub";
import PipelineHub from "./components/PipelineHub";
import AnalyticsAdmin from "./components/AnalyticsAdmin";

export default function App() {
  // Screen States
  const [authScreen, setAuthScreen] = useState<AuthScreen>("splash");
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [isSidemenuOpen, setIsSidemenuOpen] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  // App Session Data
  const [user, setUser] = useState<UserProfile | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    { id: "task_1", text: "Follow up with TechCorp", time: "10:00 AM", completed: false },
    { id: "task_2", text: "Prepare Q3 Deck", time: "2:30 PM", completed: false }
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    { id: "lead_1", name: "Eleanor Vance", company: "Acme Corp Global", score: 94, status: "Active", source: "Inbound Web" },
    { id: "lead_2", name: "Marcus Thorne", company: "Nexus Logistics", score: 78, status: "Pending", source: "Referral" },
    { id: "lead_3", name: "Sarah Jenkins", company: "Pinnacle Tech Solutions", score: 88, status: "Hot", source: "Conference Badge" }
  ]);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "int_gcal", name: "Google Calendar", connected: true, category: "Calendar", iconName: "calendar_today", statusText: "Connected" },
    { id: "int_hub", name: "HubSpot", connected: true, category: "CRM", iconName: "hub", statusText: "Connected" },
    { id: "int_sf", name: "Salesforce", connected: true, category: "CRM", iconName: "cloud", statusText: "Connected" },
    { id: "int_zoho", name: "Zoho CRM", connected: true, category: "CRM", iconName: "work", statusText: "Connected" }
  ]);

  const [alerts, setAlerts] = useState<ActiveAlert[]>([
    { id: "alert_1", type: "FUNDING EVENT", time: "10m ago", title: "Acme Corp raised $50M Series B", source: "Source: Crunchbase", colorClass: "border-primary" },
    { id: "alert_2", type: "LEADERSHIP CHANGE", time: "1h ago", title: "New VP Sales at Globex Inc.", source: "Source: LinkedIn", colorClass: "border-secondary" }
  ]);

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
    { id: "log_1", name: "Crunchbase /organizations diff", details: "24 records updated", time: "Just now", status: "success" },
    { id: "log_2", name: "LinkedIn /jobs diff", details: "3 new leadership roles detected", time: "2m ago", status: "success" },
    { id: "log_3", name: "NewsAPI /everything timeout", details: "Retrying in 60s...", time: "5m ago", status: "error" }
  ]);

  const [recentBriefs, setRecentBriefs] = useState<RecentBrief[]>([
    { id: "brief_1", title: "Acme Corp Enterprise Deal", engine: "CLAUDE 3.5", summary: "Key decision maker changed to VP Eng. Competitor evaluating feature parity. Focus on compliance.", time: "2m ago" },
    { id: "brief_2", title: "GlobalTech Q3 Expansion", engine: "CLAUDE 3.5", summary: "Budget approved for EMEA rollout. Need technical validation on API latency.", time: "15m ago" },
    { id: "brief_3", title: "Nexus Industries Renewal", engine: "GPT-4O", summary: "High churn risk. Usage dropped 30% in last quarter. Executive sponsor left company.", time: "1h ago" }
  ]);

  const [engineParams, setEngineParams] = useState<EngineParams>({
    systemPrompt: "You are an elite enterprise sales assistant. Analyze the following CRM data, email history, and transcripts to extract key pain points, decision makers, and next steps.",
    tone: "Direct & Actionable",
    maxLength: "300 words",
    autolinkEntities: true
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Persistence triggers
  useEffect(() => {
    const savedUser = localStorage.getItem("salespulse_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setAuthScreen("login"); // Directly fast-track past splash to login if session user is remembered
    }
  }, []);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setIsLoadingDashboard(true);

    // Simulate skeleton loader Screen 3 for extremely polished professional feel
    setTimeout(() => {
      setIsLoadingDashboard(false);
      setAuthScreen("signup"); // Transition auth screen to non-blocking to reveal viewport
    }, 1200);

    localStorage.setItem("salespulse_user", JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("salespulse_user");
    setAuthScreen("login");
    setActiveTab("home");
    setIsSidemenuOpen(false);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    localStorage.setItem("salespulse_user", JSON.stringify(updatedProfile));
  };

  // State modification Handlers
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleUpdateLeadStatus = (id: string, status: "Active" | "Hot" | "Pending" | "Completed") => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleToggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
    const item = integrations.find((i) => i.id === id);
    if (item) {
      handleLogActivity(
        `${item.connected ? "Suspended" : "Connected"} workflow pipeline with ${item.name}`,
        "NewsAPI"
      );
    }
  };

  const handleLogActivity = (text: string, source: string) => {
    const newLog: SyncLog = {
      id: "log_" + Date.now(),
      name: source + " feed signal",
      details: text,
      time: "Just now",
      status: "success"
    };

    setSyncLogs((prev) => [newLog, ...prev]);

    // Create an alert occasionally if source is LinkedIn/Crunchbase
    if (source !== "NewsAPI") {
      const newAlert: ActiveAlert = {
        id: "alert_" + Date.now(),
        type: source + " update signal",
        time: "Just now",
        title: text,
        source: "Source: " + source,
        colorClass: "border-primary"
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  // Mobile sidemenu navigation list options
  const sideNavItems: { label: string; tab: ActiveTab; icon: React.ReactNode }[] = [
    { label: "Dashboard Hub", tab: "home", icon: <Activity className="w-5 h-5" /> },
    { label: "Captured Leads", tab: "leads", icon: <Users className="w-5 h-5" /> },
    { label: "Pipeline & Streams", tab: "pipeline", icon: <Settings className="w-5 h-5" /> },
    { label: "Analytics & Personnel", tab: "admin", icon: <ClipboardList className="w-5 h-5" /> },
    { label: "Product Strategy Map", tab: "strategy", icon: <Map className="w-5 h-5" /> },
    { label: "Feedback Console", tab: "feedback", icon: <MessageSquare className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-slate-900 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* 1. Splash Startup sequence */}
      {authScreen === "splash" && (
        <Splash onTransitionComplete={() => setAuthScreen("login")} />
      )}

      {/* 2. Login, Signup, password restoration forms */}
      {authScreen !== "splash" && !user && (
        <AuthPages
          currentScreen={authScreen as any}
          setScreen={(s) => setAuthScreen(s as any)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 3. Skeleton Loading Indicator Screen 3 */}
      {isLoadingDashboard && <SkeletonLoader />}

      {/* 4. Complete Application Viewport */}
      {user && !isLoadingDashboard && (
        <div className="min-h-screen flex flex-col flex-1 pb-16 md:pb-0 relative">
          {/* Main Top Header & Bottom docks Navbars */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsSidemenuOpen(false);
            }}
            user={user}
            onLogout={handleLogout}
            toggleSidemenu={() => setIsSidemenuOpen(!isSidemenuOpen)}
            isSidemenuOpen={isSidemenuOpen}
            onUpdateProfile={handleUpdateProfile}
          />

          {/* Left Slideout Side Drawer Menu Context on Hamburger Menu */}
          <AnimatePresence>
            {isSidemenuOpen && (
              <div className="fixed inset-0 z-50 flex">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidemenuOpen(false)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  className="bg-white w-72 max-w-sm h-full flex flex-col justify-between p-6 relative border-r border-[#c3c5d9]/30 shadow-2xl z-10 select-none text-left"
                >
                  <div>
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5.5 h-5.5 text-primary" />
                        <span className="font-display text-lg font-bold text-slate-900">SalesPulse Desk</span>
                      </div>
                      <button
                        onClick={() => setIsSidemenuOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {sideNavItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveTab(item.tab);
                            setIsSidemenuOpen(false);
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer font-sans text-xs font-semibold uppercase tracking-wider ${
                            activeTab === item.tab
                              ? "bg-primary text-white shadow-sm font-bold"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-sans text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>End Workspace Session</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Active View Container content */}
          <main className="flex-1 flex flex-col pb-8">
            <AnimatePresence mode="wait">
              {activeTab === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <Dashboard
                    user={user}
                    tasks={tasks}
                    leads={leads}
                    onAddTask={handleAddTask}
                    onToggleTask={handleToggleTask}
                    onAddLead={handleAddLead}
                    onLogActivity={handleLogActivity}
                    onSelectLead={setSelectedLead}
                    setActiveTab={setActiveTab}
                  />
                </motion.div>
              )}

              {activeTab === "leads" && (
                <motion.div
                  key="leads"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <LeadsHub
                    leads={leads}
                    selectedLead={selectedLead}
                    onSelectLead={setSelectedLead}
                    onUpdateLeadStatus={handleUpdateLeadStatus}
                    onDeleteLead={handleDeleteLead}
                  />
                </motion.div>
              )}

              {activeTab === "pipeline" && (
                <motion.div
                  key="pipeline"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <PipelineHub
                    integrations={integrations}
                    alerts={alerts}
                    syncLogs={syncLogs}
                    recentBriefs={recentBriefs}
                    engineParams={engineParams}
                    onToggleIntegration={handleToggleIntegration}
                    onUpdateEngineParams={setEngineParams}
                    onLogActivity={handleLogActivity}
                  />
                </motion.div>
              )}

              {/* Admin consoles grouped nested tabs */}
              {(activeTab === "admin" || activeTab === "strategy" || activeTab === "feedback") && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnalyticsAdmin
                    onAddUserLog={handleLogActivity}
                    onLogActivity={handleLogActivity}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}
