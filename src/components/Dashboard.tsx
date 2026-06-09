/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserPlus, FileText, Mail, Calendar, Check, ChevronRight, Clock, Plus, Trash } from "lucide-react";
import { Task, Lead, UserProfile } from "../types";

interface DashboardProps {
  user: UserProfile | null;
  tasks: Task[];
  leads: Lead[];
  onAddTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
  onAddLead: (lead: Lead) => void;
  onLogActivity: (text: string, source: string) => void;
  onSelectLead: (lead: Lead) => void;
  setActiveTab: (tab: "home" | "leads" | "pipeline" | "admin") => void;
}

export default function Dashboard({
  user,
  tasks,
  leads,
  onAddTask,
  onToggleTask,
  onAddLead,
  onLogActivity,
  onSelectLead,
  setActiveTab
}: DashboardProps) {
  // Modal toggle states
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Form input states
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadScore, setNewLeadScore] = useState(80);
  const [newLeadSource, setNewLeadSource] = useState("Inbound Web");
  const [newLeadStatus, setNewLeadStatus] = useState<"Hot" | "Active" | "Pending" | "Completed">("Active");

  const [activityText, setActivityText] = useState("");
  const [activitySource, setActivitySource] = useState("Crunchbase");

  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");

  // Submissions
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadCompany.trim()) return;

    const added: Lead = {
      id: "lead_" + Date.now(),
      name: newLeadName,
      company: newLeadCompany,
      score: Number(newLeadScore),
      status: newLeadStatus,
      source: newLeadSource
    };

    onAddLead(added);
    onLogActivity(`Created lead for ${newLeadName} (${newLeadCompany})`, "Crunchbase");
    setIsAddLeadOpen(false);

    // Reset fields
    setNewLeadName("");
    setNewLeadCompany("");
    setNewLeadScore(85);
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityText.trim()) return;

    onLogActivity(activityText, activitySource);
    setIsLogActivityOpen(false);
    setActivityText("");
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const timeString = newTaskTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onAddTask({
      id: "task_" + Date.now(),
      text: newTaskText,
      time: timeString,
      completed: false
    });

    setIsAddTaskOpen(false);
    setNewTaskText("");
    setNewTaskTime("");
  };

  // Recent leads filter (only show the first few pending/active ones)
  const recentLeadsDisplay = leads.slice(0, 3);

  return (
    <div className="flex-1 w-full max-w-[1240px] mx-auto px-4 pt-6 pb-20 md:pb-6 flex flex-col gap-6">
      {/* Welcome Banner greeting */}
      <section className="flex flex-col gap-1 select-none">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.name || "Alex"}!
        </h1>
        <p className="text-sm text-slate-500 font-medium">Here is your pulse for today.</p>
      </section>

      {/* Quick Actions Bento Grid Row */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4 select-none">
        {/* Add Lead Action Button */}
        <button
          onClick={() => setIsAddLeadOpen(true)}
          className="bg-primary text-white rounded-2xl p-5 flex flex-col items-start gap-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group relative overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="bg-white/20 p-2.5 rounded-full inline-flex">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-base font-bold">Add Lead</span>
        </button>

        {/* Log Activity Action Button */}
        <button
          onClick={() => setIsLogActivityOpen(true)}
          className="bg-white border border-slate-200 text-slate-800 rounded-2xl p-5 flex flex-col items-start gap-4 shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-left cursor-pointer"
        >
          <div className="bg-blue-50 text-primary p-2.5 rounded-full inline-flex">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-display text-base font-bold text-slate-800">Log Activity</span>
        </button>

        {/* Action Button 3 */}
        <button
          onClick={() => setIsAddTaskOpen(true)}
          className="hidden md:flex bg-white border border-slate-200 text-slate-800 rounded-2xl p-5 flex-col items-start gap-4 shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-left cursor-pointer"
        >
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-full inline-flex">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-display text-base font-bold text-slate-800">Assign Task</span>
        </button>

        {/* Action Button 4 */}
        <button
          onClick={() => setActiveTab("pipeline")}
          className="hidden md:flex bg-white border border-slate-200 text-slate-800 rounded-2xl p-5 flex-col items-start gap-4 shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-left cursor-pointer"
        >
          <div className="bg-teal-50 text-teal-600 p-2.5 rounded-full inline-flex">
            <Mail className="w-5 h-5" />
          </div>
          <span className="font-display text-base font-bold text-slate-800">Integrate Tools</span>
        </button>
      </section>

      {/* Main Grid: Weekly chart & To-Do column */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 select-none h-fit">
        {/* Weekly Sales Pulse representation container */}
        <section className="col-span-1 md:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-lg font-bold text-[#0b1c30]">Weekly Sales Pulse</h2>
            <span className="text-xs font-bold text-primary bg-[#0051ff]/10 px-3 py-1 rounded-full">
              +12% vs last week
            </span>
          </div>

          {/* Inline SVG Chart */}
          <div className="flex-grow pt-4 flex flex-col justify-end">
            <div className="flex items-end justify-between h-40 gap-2">
              <div className="group relative flex-grow bg-slate-100 rounded-t-lg h-[35%] hover:bg-[#e5eeff] transition-all duration-200">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#213145] text-white text-[10px] uppercase font-bold py-1 px-2 rounded">
                  Mon: $4.2k
                </span>
              </div>
              <div className="group relative flex-grow bg-slate-100 rounded-t-lg h-[50%] hover:bg-[#e5eeff] transition-all duration-200">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#213145] text-white text-[10px] uppercase font-bold py-1 px-2 rounded">
                  Tue: $6.1k
                </span>
              </div>
              <div className="group relative flex-grow bg-slate-100 rounded-t-lg h-[40%] hover:bg-[#e5eeff] transition-all duration-200">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#213145] text-white text-[10px] uppercase font-bold py-1 px-2 rounded">
                  Wed: $4.8k
                </span>
              </div>
              <div className="group relative flex-grow bg-primary shadow-lg rounded-t-lg h-[85%] transition-all duration-200">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 placeholder:opacity-100 whitespace-nowrap bg-primary text-white text-[10px] uppercase font-bold py-1 px-2 rounded">
                  Active
                </span>
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0b1c30] text-white text-[10px] uppercase font-bold py-1 px-2 rounded">
                  Thu: $9.8k
                </span>
              </div>
              <div className="group relative flex-grow bg-slate-100 rounded-t-lg h-[65%] hover:bg-[#e5eeff] transition-all duration-200">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#213145] text-white text-[10px] uppercase font-bold py-1 px-2 rounded">
                  Fri: $7.2k
                </span>
              </div>
            </div>
            {/* Axis labels */}
            <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-[11px] text-slate-400 font-bold uppercase">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
          </div>
        </section>

        {/* Tasks Checklist widgets */}
        <section className="col-span-1 md:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-lg font-bold text-[#0b1c30]">Today's Tasks</h2>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="text-primary hover:text-primary-hover font-semibold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-56">
            {tasks.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8">No tasks scheduled for today. Complete ahead of schedule!</div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group"
                >
                  <div
                    className={`mt-0.5 w-[18px] h-[18px] rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                      task.completed
                        ? "bg-emerald-600 border-emerald-600"
                        : "border-slate-300 group-hover:border-primary"
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-slate-700 text-xs font-semibold ${
                        task.completed ? "line-through text-slate-400" : ""
                      }`}
                    >
                      {task.text}
                    </span>
                    <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {task.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Recent Leads Module list */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col select-none">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-[#f8f9ff]">
          <h2 className="font-display text-base font-bold text-slate-900">Recent Leads</h2>
          <button
            onClick={() => setActiveTab("leads")}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            Manage All
          </button>
        </div>

        <div className="flex flex-col">
          {recentLeadsDisplay.map((lead) => {
            const isHot = lead.status === "Hot";
            return (
              <div
                key={lead.id}
                onClick={() => {
                  onSelectLead(lead);
                  setActiveTab("leads");
                }}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 relative group"
              >
                {/* Visual Accent bar indicator matching Screens */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[3.5px] ${
                    isHot ? "bg-emerald-500" : "bg-primary"
                  }`}
                />

                <div className="flex items-center gap-4 pl-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm tracking-wide shadow-sm ${
                      isHot ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-primary"
                    }`}
                  >
                    {lead.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{lead.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {lead.company}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isHot ? "bg-emerald-55 text-emerald-800" : "bg-blue-50 text-primary"
                    }`}
                  >
                    {lead.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== MODALS / OVERLAYS ==================== */}
      <AnimatePresence>
        {/* ADD LEAD DIALOG OVERLAY */}
        {isAddLeadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddLeadOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-100 z-10"
            >
              <div className="bg-primary text-white p-5">
                <h3 className="font-display text-lg font-bold">Add Generated Lead</h3>
                <p className="text-xs opacity-80">Populate the automated capture records immediately</p>
              </div>
              <form onSubmit={handleLeadSubmit} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Lead Full Name</label>
                  <input
                    required
                    placeholder="E.g., John Miller"
                    className="w-full border border-slate-200 p-3 rounded-lg text-xs"
                    type="text"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Lead Enterprise</label>
                  <input
                    required
                    placeholder="E.g., TechCorp Global"
                    className="w-full border border-slate-200 p-3 rounded-lg text-xs"
                    type="text"
                    value={newLeadCompany}
                    onChange={(e) => setNewLeadCompany(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Priority score (1 - 100)</label>
                  <input
                    required
                    min="1"
                    max="100"
                    className="w-full border border-slate-200 p-3 rounded-lg text-xs"
                    type="number"
                    value={String(newLeadScore)}
                    onChange={(e) => setNewLeadScore(Number(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Lead Source</label>
                    <select
                      className="border border-slate-200 p-3 rounded-lg text-xs bg-white"
                      value={newLeadSource}
                      onChange={(e) => setNewLeadSource(e.target.value)}
                    >
                      <option>Inbound Web</option>
                      <option>Referral</option>
                      <option>Conference Badge</option>
                      <option>LinkedIn Scraping</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Status</label>
                    <select
                      className="border border-slate-200 p-3 rounded-lg text-xs bg-white"
                      value={newLeadStatus}
                      onChange={(e) => setNewLeadStatus(e.target.value as any)}
                    >
                      <option value="Active">Active</option>
                      <option value="Hot">Hot</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddLeadOpen(false)}
                    className="text-slate-500 font-semibold text-xs py-2 px-4 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0052ff] hover:bg-primary text-white font-semibold text-xs py-3 px-5 rounded-lg shadow-md cursor-pointer"
                  >
                    Register Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* LOG ACTIVITY OVERLAY */}
        {isLogActivityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogActivityOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative border border-slate-100 z-10"
            >
              <div className="bg-[#006e92] text-white p-5">
                <h3 className="font-display text-lg font-bold">Log Activity</h3>
                <p className="text-xs opacity-80">Track custom events directly inside real-time metrics logs</p>
              </div>
              <form onSubmit={handleActivitySubmit} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Detailed Action / Note</label>
                  <textarea
                    required
                    placeholder="E.g., Conducted tech evaluation with TechCorp. Discussed GCP integrations."
                    className="w-full border border-slate-200 p-3 rounded-lg text-xs"
                    rows={4}
                    value={activityText}
                    onChange={(e) => setActivityText(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Source Stream</label>
                  <select
                    className="border border-slate-200 p-3 rounded-lg text-xs bg-white"
                    value={activitySource}
                    onChange={(e) => setActivitySource(e.target.value)}
                  >
                    <option>Crunchbase</option>
                    <option>LinkedIn</option>
                    <option>NewsAPI</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsLogActivityOpen(false)}
                    className="text-slate-500 font-semibold text-xs py-2 px-4 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#006e92] hover:bg-[#005471] text-white font-semibold text-xs py-3 px-5 rounded-lg shadow-md cursor-pointer"
                  >
                    Log Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ASSIGN/ADD TASKS OVERLAY */}
        {isAddTaskOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddTaskOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative border border-slate-100 z-10"
            >
              <div className="bg-slate-900 text-white p-5">
                <h3 className="font-display text-lg font-bold">Assign Today's Task</h3>
                <p className="text-xs opacity-80">Organize schedule milestones to hit daily quotas</p>
              </div>
              <form onSubmit={handleTaskSubmit} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Task Summary</label>
                  <input
                    required
                    placeholder="E.g., Prepare Q3 Pitch Deck"
                    className="w-full border border-slate-200 p-3 rounded-lg text-xs"
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Scheduled Time</label>
                  <input
                    placeholder="E.g., 2:30 PM (optional)"
                    className="w-full border border-slate-200 p-3 rounded-lg text-xs"
                    type="text"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddTaskOpen(false)}
                    className="text-slate-500 font-semibold text-xs py-2 px-4 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-black text-white font-semibold text-xs py-3 px-5 rounded-lg shadow-md cursor-pointer"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
