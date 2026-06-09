/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  ListCollapse, Search, Bell, Activity, Users, Settings, ClipboardList, HelpCircle, X, Check, Pencil,
  Video, Phone, Plus, BellRing, Calendar, Clock, Sparkles, ChevronRight
} from "lucide-react";
import { ActiveTab, UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";

// Dynamic image reference to bypass TypeScript static import check for non-module assets
const defaultAvatar = new URL("../assets/images/user_avatar_1780996767121.png", import.meta.url).href;

export interface ClientReminder {
  id: string;
  type: "meeting" | "call" | "general";
  title: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  time: string;
  details: string;
  status: "active" | "snoozed" | "completed";
  link?: string;
}

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile | null;
  onLogout: () => void;
  toggleSidemenu: () => void;
  isSidemenuOpen: boolean;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  toggleSidemenu,
  isSidemenuOpen,
  onUpdateProfile
}: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Notifications Window states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<ClientReminder[]>([
    {
      id: "rem_1",
      type: "meeting",
      title: "Quarterly Enterprise SLA Review",
      clientName: "Sarah Jenkins",
      clientCompany: "Pinnacle Tech Solutions",
      clientEmail: "sarah.jenkins@pinnacle.io",
      clientPhone: "+1 (555) 382-9011",
      time: "Today at 11:30 AM",
      details: "Discuss SaaS SLA compliance, API latency guarantees, and review Q3 upgrade possibilities.",
      status: "active",
      link: "https://meet.google.com/pinnacle-sla-review"
    },
    {
      id: "rem_2",
      type: "call",
      title: "Callback: Q3 Scale Negotiation",
      clientName: "Marcus Thorne",
      clientCompany: "Nexus Logistics",
      clientEmail: "marcus.thorne@nexuslog.com",
      clientPhone: "+1 (555) 794-2039",
      time: "Today at 2:45 PM",
      details: "Discuss server capacity expansion requirements and high-throughput data pipes.",
      status: "active"
    },
    {
      id: "rem_3",
      type: "meeting",
      title: "Discovery & Warm Intro",
      clientName: "Eleanor Vance",
      clientCompany: "Acme Corp Global",
      clientEmail: "eleanor@acmeglobal.com",
      clientPhone: "+1 (555) 912-3200",
      time: "Tomorrow at 10:00 AM",
      details: "Explore full-stack CRM integrations and custom threat telemetry syncing options.",
      status: "active",
      link: "https://meet.google.com/discovery-acme-rep"
    }
  ]);

  const [selectedDetailedReminder, setSelectedDetailedReminder] = useState<ClientReminder | null>(null);

  // Form states for creating a new reminder
  const [showAddReminderForm, setShowAddReminderForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] = useState<"meeting" | "call">("meeting");
  const [newDetails, setNewDetails] = useState("");

  const handleAddCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClientName.trim()) return;

    const reminder: ClientReminder = {
      id: `rem_custom_${Date.now()}`,
      type: newType,
      title: newTitle,
      clientName: newClientName,
      clientCompany: newCompany || "Independent",
      clientEmail: newEmail || "no-email@company.com",
      clientPhone: newPhone || "N/A",
      time: newTime || "As scheduled",
      details: newDetails || "No additional notes provided.",
      status: "active",
      link: newType === "meeting" ? "https://meet.google.com/custom-session" : undefined
    };

    setNotifications([reminder, ...notifications]);
    
    // Reset fields
    setNewTitle("");
    setNewClientName("");
    setNewCompany("");
    setNewEmail("");
    setNewPhone("");
    setNewTime("");
    setNewDetails("");
    setShowAddReminderForm(false);
  };

  const handleSnoozeReminder = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, time: "Snoozed (in 15 mins)", status: "snoozed" as const } : n
      )
    );
  };

  const handleCompleteReminder = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, status: "completed" as const } : n
      )
    );
  };

  const activeRemindersCount = notifications.filter((n) => n.status !== "completed").length;

  // Form states for profile editing
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editRole, setEditRole] = useState(user?.role || "");
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatarUrl || "");
  const [isUsingPreset, setIsUsingPreset] = useState(true);
  const [isUsingCustomUrl, setIsUsingCustomUrl] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarPresets = [
    { label: "Original AI", url: defaultAvatar },
    { label: "Exec Woman 1", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" },
    { label: "Exec Woman 2", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" },
    { label: "Exec Man 1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" }
  ];

  // Sync profile details when user changes or modal opens
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditRole(user.role || "");
      setEditAvatarUrl(user.avatarUrl || "");
    }
  }, [user, isEditModalOpen]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) return;
    onUpdateProfile({
      name: editName,
      email: editEmail,
      role: editRole,
      avatarUrl: editAvatarUrl
    });
    setIsEditModalOpen(false);
  };
  // Navigation tabs definition
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Activity className="w-5 h-5" /> },
    { id: "leads", label: "Leads", icon: <Users className="w-5 h-5" /> },
    { id: "pipeline", label: "Pipeline", icon: <Settings className="w-5 h-5" /> },
    { id: "admin", label: "Admin", icon: <ClipboardList className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* TopAppBar header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#c3c5d9]/30 h-16 shadow-sm flex items-center justify-between w-full px-4 select-none">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <button
            onClick={toggleSidemenu}
            className="text-on-surface-variant hover:bg-slate-100 p-2 rounded-full active:scale-95 duration-100 ease-in-out md:hidden outline-none cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            <ListCollapse className="w-5 h-5" />
          </button>

          {/* Desktop Logo & Title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("home")}>
            <Activity className="w-6 h-6 text-primary h-animate" />
            <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-[#0052ff] bg-clip-text text-transparent">
              SalesPulse
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex ml-8 gap-1 items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-sans font-semibold text-xs tracking-wide uppercase px-3 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-500 hover:text-[#0b1c30] hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Avatar / Notification area */}
        <div className="flex items-center gap-3">
          {/* Notifications button & Window Dropdown */}
          <div className="relative shadow-none" ref={notificationRef}>
            <button
              id="notification-bell-btn"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`duration-200 p-2 rounded-full relative cursor-pointer outline-none transition-all ${
                isNotificationsOpen ? "bg-slate-100 text-primary" : "text-slate-600 hover:bg-slate-100"
              }`}
              aria-label="Toggle notifications menu"
            >
              <Bell className="w-5 h-5 animate-none" />
              {activeRemindersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-3 w-3 select-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 text-[8.5px] text-white font-black items-center justify-center border border-white">
                    {activeRemindersCount}
                  </span>
                </span>
              )}
            </button>

            {/* Notifications Window Dropdown Popover */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full pt-2 z-50 text-left w-[335px] sm:w-[380px] md:w-[410px] select-none"
                >
                  <div className="bg-white border border-slate-200/80 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto hover:shadow-3xl transition-shadow">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                       <div className="flex items-center gap-1.5">
                         <BellRing className="w-4 h-4 text-primary" />
                         <span className="text-xs font-extrabold text-slate-800 tracking-tight">Reminders & Client Meetings</span>
                         <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                           {activeRemindersCount} Active
                         </span>
                       </div>
                       <button
                         id="add-reminder-toggle-btn"
                         onClick={() => setShowAddReminderForm(!showAddReminderForm)}
                         className="text-[10px] font-bold text-primary hover:text-indigo-700 hover:underline cursor-pointer flex items-center gap-1 bg-slate-50 hover:bg-slate-100/80 px-2 py-1 rounded-lg transition-all"
                       >
                         <Plus className="w-3 h-3" />
                         {showAddReminderForm ? "View List" : "Schedule"}
                       </button>
                    </div>

                    {/* Conditional Add Form */}
                    {showAddReminderForm ? (
                      <form onSubmit={handleAddCustomReminder} className="flex flex-col gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                          Add Client Reminder
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">REMINDER TITLE / OBJECTIVE</label>
                          <input
                            id="new-reminder-title"
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="e.g. Discovery Call, Deal Closing Meet"
                            required
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-primary transition-all font-medium text-slate-800"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-0.5">CLIENT NAME</label>
                            <input
                              id="new-reminder-client"
                              type="text"
                              value={newClientName}
                              onChange={(e) => setNewClientName(e.target.value)}
                              placeholder="e.g. John Miller"
                              required
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-primary transition-all font-medium text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-0.5">COMPANY</label>
                            <input
                              id="new-reminder-company"
                              type="text"
                              value={newCompany}
                              onChange={(e) => setNewCompany(e.target.value)}
                              placeholder="e.g. Acme Corp"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-primary transition-all font-medium text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-0.5">EMAIL ADDRESS</label>
                            <input
                              id="new-reminder-email"
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              placeholder="john@company.com"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-primary transition-all font-medium text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-0.5">PHONE NUMBER</label>
                            <input
                              id="new-reminder-phone"
                              type="text"
                              value={newPhone}
                              onChange={(e) => setNewPhone(e.target.value)}
                              placeholder="+1 (555) 019-2834"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-primary transition-all font-medium text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-0.5">SCHEDULED TIME</label>
                            <input
                              id="new-reminder-time"
                              type="text"
                              value={newTime}
                              onChange={(e) => setNewTime(e.target.value)}
                              placeholder="e.g. Today at 4:30 PM"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-primary transition-all text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 block mb-0.5">EVENT TYPE</label>
                            <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 gap-0.5">
                              <button
                                type="button"
                                id="type-meet-btn"
                                onClick={() => setNewType("meeting")}
                                className={`flex-1 text-[9px] font-extrabold py-0.5 rounded transition-colors cursor-pointer ${
                                  newType === "meeting" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100"
                                }`}
                              >
                                Meeting
                              </button>
                              <button
                                type="button"
                                id="type-call-btn"
                                onClick={() => setNewType("call")}
                                className={`flex-1 text-[9px] font-extrabold py-0.5 rounded transition-colors cursor-pointer ${
                                  newType === "call" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100"
                                }`}
                              >
                                Call
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">DISCUSSION FOCUS / AGENDA</label>
                          <textarea
                            id="new-reminder-details"
                            rows={1}
                            value={newDetails}
                            onChange={(e) => setNewDetails(e.target.value)}
                            placeholder="Discuss pricing and deployment requirements..."
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-primary transition-all resize-none font-medium text-slate-800"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            id="cancel-add-reminder-btn"
                            type="button"
                            onClick={() => setShowAddReminderForm(false)}
                            className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-755 cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            id="save-new-reminder-btn"
                            type="submit"
                            className="px-3 py-1 bg-primary hover:bg-indigo-700 rounded-lg text-[10px] font-bold text-white shadow-sm cursor-pointer transition-colors"
                          >
                            Save Reminder
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-0.5">
                        {notifications.length === 0 ? (
                          <div className="py-8 px-4 text-center">
                            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <div className="text-xs font-bold text-slate-600">All caught up!</div>
                            <div className="text-[10px] text-slate-400 mt-1">No pending client calls or meetings right now.</div>
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              className={`border p-3 rounded-xl transition-all relative flex flex-col gap-1.5 ${
                                item.status === "completed"
                                  ? "bg-slate-50 opacity-60 border-slate-200/60"
                                  : item.status === "snoozed"
                                  ? "bg-amber-50/20 border-amber-200/50"
                                  : item.type === "meeting"
                                  ? "bg-blue-50/30 border-blue-100 hover:bg-blue-50/50"
                                  : "bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50/50"
                              }`}
                            >
                              {/* Left status vertical ribbon */}
                              <div
                                className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md ${
                                  item.status === "completed"
                                    ? "bg-slate-300"
                                    : item.type === "meeting"
                                    ? "bg-blue-500"
                                    : "bg-emerald-500"
                                }`}
                              />

                              {/* Title line and Category pill */}
                              <div className="pl-2">
                                 <div className="flex items-start justify-between gap-2 text-left">
                                   <span className={`text-xs font-bold ${item.status === "completed" ? "text-slate-500 line-through" : "text-slate-800"}`}>
                                      {item.title}
                                   </span>
                                   <div className="flex items-center gap-1 flex-shrink-0">
                                      <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide ${
                                        item.type === "meeting"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-emerald-100 text-emerald-700"
                                      }`}>
                                        {item.type}
                                      </span>
                                   </div>
                                 </div>

                                 {/* Time & Scheduling */}
                                 <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mt-0.5">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{item.time}</span>
                                 </div>

                                 {/* Client details overview card */}
                                 <div className="bg-white/80 border border-slate-100/80 rounded-lg p-2.5 mt-2 shadow-sm flex flex-col gap-1.5 text-left">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-extrabold text-slate-700">{item.clientName}</span>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.clientCompany}</span>
                                    </div>

                                    {/* Actionable phone & email channels */}
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-slate-500 border-t border-slate-50/80 pt-1.5">
                                       <a
                                         href={`tel:${item.clientPhone}`}
                                         className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                                         onClick={(e) => e.stopPropagation()}
                                       >
                                         <Phone className="w-2.5 h-2.5 text-slate-400" />
                                         <span>{item.clientPhone}</span>
                                       </a>
                                       <span className="text-slate-300">•</span>
                                       <a
                                         href={`mailto:${item.clientEmail}`}
                                         className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                                         onClick={(e) => e.stopPropagation()}
                                       >
                                         <span className="text-[9px] font-bold text-slate-400">@</span>
                                         <span className="truncate max-w-[130px]">{item.clientEmail}</span>
                                       </a>
                                    </div>
                                 </div>

                                 {/* Brief agenda details */}
                                 <p className="text-[10px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed bg-slate-50/50 p-1.5 rounded-md italic text-left">
                                    “{item.details}”
                                 </p>

                                 {/* Interactive operations */}
                                 {item.status !== "completed" && (
                                   <div className="flex gap-1.5 justify-end mt-2.5 border-t border-slate-100 pt-2">
                                      <button
                                         id={`snooze-btn-${item.id}`}
                                         onClick={() => handleSnoozeReminder(item.id)}
                                         className="px-2 py-1 hover:bg-slate-100 text-slate-500 hover:text-slate-700 bg-white rounded-lg border border-slate-200 text-[9.5px] font-bold cursor-pointer transition-all"
                                      >
                                         Snooze
                                      </button>
                                      
                                      <button
                                         id={`details-btn-${item.id}`}
                                         onClick={() => setSelectedDetailedReminder(item)}
                                         className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[9.5px] font-bold cursor-pointer transition-all"
                                      >
                                         Bio Card
                                      </button>

                                      {item.link && (
                                         <a
                                            id={`join-btn-${item.id}`}
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[9.5px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                                            onClick={(e) => e.stopPropagation()}
                                         >
                                            <Video className="w-2.5 h-2.5" />
                                            <span>Join</span>
                                         </a>
                                      )}

                                      <button
                                         id={`done-btn-${item.id}`}
                                         onClick={() => handleCompleteReminder(item.id)}
                                         className="px-2 py-1 bg-primary hover:bg-indigo-700 text-white rounded-lg text-[9.5px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                                      >
                                         <Check className="w-2.5 h-2.5" />
                                         <span>Done</span>
                                      </button>
                                   </div>
                                 )}

                                 {item.status === "completed" && (
                                    <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold mt-2 pl-1 bg-emerald-50/50 p-1 rounded">
                                       <Check className="w-3 h-3" />
                                       <span>Call context logged directly to CRM integration</span>
                                    </div>
                                 )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User profile picture trigger */}
          <div className="flex items-center gap-2 relative shadow-none" ref={dropdownRef}>
            <button
              id="header-profile-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-full overflow-hidden border border-[#c3c5d9]/40 hover:shadow-md hover:border-primary/50 transition-all active:scale-95 duration-150 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Profile navigation menu"
            >
              <img
                alt="Active executive user profile avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                src={
                  user?.avatarUrl ||
                  defaultAvatar
                }
              />
            </button>

            {/* Logout prompt dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full pt-2 z-50 text-left min-w-[210px]"
                >
                  <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-3.5 flex flex-col gap-1.5 hover:shadow-2xl transition-shadow">
                    <div className="border-b border-slate-100 pb-2.5 mb-1.5 text-left select-none">
                      <div className="text-sm font-bold text-slate-800 line-clamp-1">{user?.name}</div>
                      <div className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">{user?.role || "sales rep"}</div>
                      <div className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{user?.email}</div>
                    </div>
                    
                    <button
                      id="edit-profile-menu-button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      className="w-full text-left text-xs font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 p-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 hover:pl-3"
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-primary" />
                      Edit Profile
                    </button>

                    <button
                      id="logout-menu-button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left text-xs font-semibold text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 hover:pl-3"
                    >
                      <X className="w-3.5 h-3.5 text-red-400" />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Edit Profile Modal Dialog */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm md:max-w-md w-full border border-slate-200 z-10 relative select-none text-left"
            >
              {/* Close Button */}
              <button
                id="close-profile-modal-btn"
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 cursor-pointer transition-colors"
                aria-label="Close edit modal"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-display text-lg font-bold text-slate-950 mb-4">Edit Profile Settings</h3>

              <div className="flex flex-col gap-4">
                {/* Profile Photo Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Profile Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Current Photo preview */}
                    <div className="relative group/avatar w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm flex-shrink-0">
                      <img
                        src={editAvatarUrl || defaultAvatar}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Presets List */}
                    <div className="flex-1">
                      <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wide">Select Preset Avatar:</div>
                      <div className="flex gap-2 items-center">
                        {avatarPresets.map((preset, idx) => (
                          <button
                            id={`preset-avatar-btn-${idx}`}
                            key={idx}
                            type="button"
                            onClick={() => {
                              setEditAvatarUrl(preset.url);
                              setIsUsingPreset(true);
                            }}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all relative cursor-pointer ${
                              editAvatarUrl === preset.url && isUsingPreset
                                ? "border-primary scale-105 shadow-md"
                                : "border-slate-100 opacity-80 hover:opacity-100 hover:scale-102"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {editAvatarUrl === preset.url && isUsingPreset && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white filter drop-shadow" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Custom URL Input toggle */}
                  <div className="mt-3">
                    <button
                      id="custom-avatar-url-toggle"
                      type="button"
                      onClick={() => setIsUsingCustomUrl(!isUsingCustomUrl)}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {isUsingCustomUrl ? "Close custom URL customizer" : "Or enter a custom image URL"}
                    </button>

                    {isUsingCustomUrl && (
                      <input
                        id="custom-avatar-url-input"
                        type="url"
                        value={editAvatarUrl}
                        onChange={(e) => {
                          setEditAvatarUrl(e.target.value);
                          setIsUsingPreset(false);
                        }}
                        placeholder="https://images.unsplash.com/... or base64"
                        className="w-full mt-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                      />
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label htmlFor="profile-edit-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <input
                      id="profile-edit-name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-edit-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Corporate Email
                    </label>
                    <input
                      id="profile-edit-email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-edit-role" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Role / Position
                    </label>
                    <input
                      id="profile-edit-role"
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      placeholder="e.g. Account Executive"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Saving / Modal navigation action triggers */}
                <div className="flex gap-2.5 mt-2 justify-end">
                  <button
                    id="cancel-profile-edit-btn"
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-profile-edit-btn"
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-indigo-700 shadow-md rounded-xl cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Client Biography Intelligence Card */}
      <AnimatePresence>
        {selectedDetailedReminder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailedReminder(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm md:max-w-md w-full border border-slate-200 z-10 relative select-none text-left"
            >
              <button
                id="close-bio-modal"
                onClick={() => setSelectedDetailedReminder(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 cursor-pointer transition-colors"
                aria-label="Close client bio"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-lg">
                  {selectedDetailedReminder.clientName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-slate-900">{selectedDetailedReminder.clientName}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{selectedDetailedReminder.clientCompany}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 select-none">Reminder Connection</div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 text-left">
                    <div className="text-xs font-bold text-slate-800">{selectedDetailedReminder.title}</div>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3" />
                        {selectedDetailedReminder.time}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{selectedDetailedReminder.type} event</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Direct Channels</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href={`tel:${selectedDetailedReminder.clientPhone}`}
                      className="flex flex-col justify-center p-2.5 bg-slate-50 border border-slate-200/40 rounded-xl hover:border-primary/40 transition-colors text-left"
                    >
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Phone Line</span>
                      <span className="font-bold text-slate-800 mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {selectedDetailedReminder.clientPhone}
                      </span>
                    </a>
                    <a
                      href={`mailto:${selectedDetailedReminder.clientEmail}`}
                      className="flex flex-col justify-center p-2.5 bg-slate-50 border border-slate-200/40 rounded-xl hover:border-primary/20 transition-colors text-left"
                    >
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Email Inbox</span>
                      <span className="font-bold text-slate-800 mt-1 truncate block">
                        {selectedDetailedReminder.clientEmail}
                      </span>
                    </a>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CRM Client Briefing</div>
                  <div className="text-xs leading-relaxed text-slate-600 bg-indigo-50/20 p-3.5 rounded-xl border border-indigo-100/50 text-left">
                    <p className="font-medium">
                      {selectedDetailedReminder.details}
                    </p>
                    <p className="mt-2 text-[10px] font-bold text-indigo-700/80 uppercase">
                      Suggested pitch: Highlight real-time sync speed and compliance guarantees.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button
                    id="dismiss-bio-btn"
                    onClick={() => setSelectedDetailedReminder(null)}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-50 cursor-pointer transition-all"
                  >
                    Close Bio Card
                  </button>
                  {selectedDetailedReminder.link && (
                    <a
                      id="launch-meet-bio-btn"
                      href={selectedDetailedReminder.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-indigo-700 shadow-md rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Launch Meet</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigator for Mobile devices */}
      <nav className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#c3c5d9]/30 fixed bottom-0 left-0 w-full z-40 select-none pb-safe h-[68px] flex items-center justify-around shadow-[0_-4px_12px_rgba(10,25,47,0.05)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-all duration-100 rounded-2xl cursor-pointer ${
                isActive
                  ? "bg-primary/10 text-primary scale-102 font-bold"
                  : "text-slate-500 hover:text-slate-700 active:scale-95"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold tracking-wider mt-1 uppercase">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
