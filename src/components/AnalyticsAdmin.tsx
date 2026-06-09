/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Database, ShieldCheck, Hourglass, Landmark, Trophy, Mail, Download,
  Star, Bug, Lightbulb, MessageSquare, ChevronRight, PlusCircle, UserPlus
} from "lucide-react";
import { UserProfile, FeedbackSubmission } from "../types";

interface AnalyticsAdminProps {
  onAddUserLog: (text: string, source: string) => void;
  onLogActivity: (text: string, source: string) => void;
}

type SubAdminTab = "metrics" | "strategy" | "feedback";

export default function AnalyticsAdmin({ onAddUserLog, onLogActivity }: AnalyticsAdminProps) {
  const [subTab, setSubTab] = useState<SubAdminTab>("metrics");

  // State-controlled metrics tickers
  const [queryCount, setQueryCount] = useState(4.2);
  const [redisLatency, setRedisLatency] = useState(12);
  const [tokensActive, setTokensActive] = useState(842);

  // Random tickers simulator to simulate live database load
  useEffect(() => {
    const timer = setInterval(() => {
      setQueryCount((prev) => Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      setRedisLatency((prev) => Math.max(5, Math.min(25, Math.round(prev + (Math.random() * 4 - 2)))));
      setTokensActive((prev) => Math.round(prev + (Math.random() * 6 - 3)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Personnel management array simulator (Screen 8)
  const [personnel, setPersonnel] = useState<UserProfile[]>([
    { name: "Sarah Jenkins", email: "sarah@salespulse.com", role: "VP Sales" },
    { name: "Michael Chen", email: "michael@salespulse.com", role: "Account Exec" },
    { name: "David Ross", email: "david@salespulse.com", role: "SDR" },
    { name: "Elena Lopez", email: "elena@salespulse.com", role: "RevOps" }
  ]);

  // Handle personnel addition or role revisions
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonRole, setNewPersonRole] = useState("Sales Manager");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;

    const newPerson: UserProfile = {
      name: newPersonName,
      email: `${newPersonName.toLowerCase().replace(/\s+/g, "")}@salespulse.com`,
      role: newPersonRole
    };

    setPersonnel((prev) => [...prev, newPerson]);
    onLogActivity(`Provisioned SalesPulse credential access for ${newPersonName} (${newPersonRole})`, "LinkedIn");
    setIsAddUserOpen(false);
    setNewPersonName("");
  };

  // Star Feedback entries states
  const [starRating, setStarRating] = useState<number>(5);
  const [fbType, setFeedbackType] = useState<"bug" | "feature" | "general">("general");
  const [comments, setComments] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMsg("Feedback Submitted! Synchronizing back to team board...");
    
    onLogActivity(`Recorded satisfaction feedback: ${starRating} Stars / ${fbType}`, "NewsAPI");

    setTimeout(() => {
      setToastMsg("");
      setComments("");
      setStarRating(5);
    }, 2800);
  };

  return (
    <div className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 select-none relative">
      {/* Toast alert popup */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-55 bg-indigo-900 border border-indigo-700 shadow-2xl rounded-xl p-4 flex items-center gap-3 text-white max-w-sm"
          >
            <Star className="w-5 h-5 text-yellow-400 stroke-[3px]" />
            <span className="text-xs font-semibold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Analytics &amp; Strategy</h2>
          <p className="text-sm text-slate-500 font-medium">Control system, analyze funnel statistics, and provide feedback.</p>
        </div>

        {/* top navigation tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-[#c3c5d9]/20 self-start">
          <button
            onClick={() => setSubTab("metrics")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === "metrics" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            DB metrics &amp; Users
          </button>
          <button
            onClick={() => setSubTab("strategy")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === "strategy" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Product Strategy Matrix
          </button>
          <button
            onClick={() => setSubTab("feedback")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === "feedback" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Feedback Form Console
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === "metrics" ? (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Database & authentication widgets row (Screen 8) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* PostgreSQL metrics card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between h-40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left select-none">
                      <h4 className="text-xs font-bold text-slate-900">PostgreSQL</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">primary cluster</p>
                    </div>
                  </div>
                  <span className="bg-teal-50 text-teal-700 text-[10px] font-bold py-0.5 px-2 rounded uppercase font-sans">optimal</span>
                </div>
                <div className="flex items-end justify-between select-none">
                  <div>
                    <h5 className="text-3xl font-display font-bold text-slate-900">{queryCount}k</h5>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">queries / second</p>
                  </div>
                  {/* Miniature Sparklines */}
                  <div className="flex items-end gap-0.5 h-10 w-16 opacity-75">
                    <div className="bg-blue-100 w-full rounded-t h-[30%]" />
                    <div className="bg-blue-200 w-full rounded-t h-[50%]" />
                    <div className="bg-primary/50 w-full rounded-t h-[70%]" />
                    <div className="bg-primary w-full rounded-t h-[100%]" />
                  </div>
                </div>
              </div>

              {/* Redis Metric Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between h-40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#005471]" />
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                      <Hourglass className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left select-none">
                      <h4 className="text-xs font-bold text-slate-900">Redis Cache</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase font-sans">memory store</p>
                    </div>
                  </div>
                  <span className="bg-blue-50 text-primary text-[10px] font-bold py-0.5 px-2 rounded uppercase font-sans">99% hit rate</span>
                </div>
                <div className="flex items-end justify-between select-none">
                  <div>
                    <h5 className="text-3xl font-display font-bold text-slate-900">{redisLatency}ms</h5>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">avg load latency</p>
                  </div>
                  <div className="bg-slate-100 h-2.5 rounded-full w-24 overflow-hidden mb-1">
                    <div className="bg-[#006e92] h-full rounded-full transition-all" style={{ width: `${Math.round(100 - redisLatency)}%` }} />
                  </div>
                </div>
              </div>

              {/* Firebase authorization metrics card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between h-40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-400" />
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                      <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left select-none">
                      <h4 className="text-xs font-bold text-slate-900">Firebase Auth</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase font-sans">identity layer</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold py-0.5 px-2 border border-slate-200 rounded uppercase font-sans">syncing</span>
                </div>
                <div className="flex items-end justify-between select-none">
                  <div>
                    <h5 className="text-3xl font-display font-bold text-slate-900">{tokensActive}</h5>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">active active tokens</p>
                  </div>
                  <span className="text-xs font-bold text-[#003ec7] font-mono leading-none mb-1 flex items-center pr-1">↑ 12%</span>
                </div>
              </div>
            </div>

            {/* Down content segment: Funnel chart on left & Active Personnel on right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Conversion Funnel */}
              <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm md:col-span-8 flex flex-col justify-between h-96">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Lead Conversion Funnel</h3>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Trailing 30 Days analytical metrics</p>
                </div>

                {/* Inline HTML representation Funnel bars */}
                <div className="flex-grow pt-4 flex-col justify-end flex relative">
                  {/* Y Axis line helper */}
                  <div className="absolute left-0 h-full w-10 flex flex-col justify-between text-[11px] text-slate-400 border-r border-slate-100 py-3 font-mono">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>

                  <div className="flex-grow pl-14 flex items-end justify-around pb-8 relative">
                    {/* Bar 1 */}
                    <div className="w-14 h-[90%] bg-gradient-to-t from-primary to-[#0052ff] hover:opacity-90 transition-opacity rounded-t-lg relative group">
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap">Acquired</span>
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#0b1c30] text-white text-[10px] py-1 px-2 rounded shadow text-sans whitespace-nowrap">12,400 leads</span>
                    </div>
                    {/* Bar 2 */}
                    <div className="w-14 h-[65%] bg-gradient-to-t from-primary to-[#0052ff] hover:opacity-90 transition-opacity rounded-t-lg relative group">
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap">Qualified</span>
                    </div>
                    {/* Bar 3 */}
                    <div className="w-14 h-[40%] bg-gradient-to-t from-primary to-[#0052ff] hover:opacity-90 transition-opacity rounded-t-lg relative group">
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap">Proposed</span>
                    </div>
                    {/* Bar 4 */}
                    <div className="w-14 h-[25%] bg-[#0052ff] hover:opacity-95 transition-opacity rounded-t-lg relative group">
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-900 font-sans font-bold whitespace-nowrap">Closed</span>
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#0b1c30] text-white text-[10px] py-1 px-2 rounded shadow text-sans whitespace-nowrap">3,100 Deals</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Personnel registers list */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm md:col-span-4 flex flex-col justify-between h-96 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
                  <h3 className="font-display text-sm font-bold text-slate-900">Active Personnel</h3>
                  <button
                    onClick={() => setIsAddUserOpen(true)}
                    className="text-primary hover:bg-[#e5eeff] rounded-full p-1.5 transition-all outline-none cursor-pointer"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
                  {personnel.map((p, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 font-bold text-xs uppercase flex items-center justify-center shrink-0 border border-slate-200">
                          {p.name.slice(0, 2)}
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                          <p className="text-[10px] font-semibold text-slate-400 capitalize">{p.role}</p>
                        </div>
                      </div>
                      <span className="bg-[#eff4ff] text-primary border border-blue-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0">
                        active
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-slate-100 bg-[#f8f9ff]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Registered credentials</span>
                </div>
              </section>
            </div>
          </motion.div>
        ) : subTab === "strategy" ? (
          /* Product strategy mockup and WABU widgets row (Screen 11) */
          <motion.div
            key="strategy"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <section className="text-left max-w-3xl">
              <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-primary border border-blue-100 text-[10px] font-bold uppercase tracking-wider mb-2">
                Executive Strategy Dashboard
              </span>
              <h1 className="font-display text-2xl font-bold text-slate-900">Precision Execution at Scale</h1>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans font-medium text-slate-500">
                SalesPulse transforms field operations by turning complex CRM data into rapid, actionable insights. We equip high-performing sales teams with the exact sales intelligence they need, exactly when they need it, accelerating the path from prospect to closed revenue.
              </p>
            </section>

            {/* legacy vs mobile comparisons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Legacy card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between h-32 text-left">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Legacy CRM</span>
                <div>
                  <div className="text-3xl font-display font-bold text-slate-400">3m 55s</div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">avg preparation period per account</p>
                </div>
              </div>

              {/* Mobile Card */}
              <div className="bg-primary text-white rounded-2xl p-5 flex flex-col justify-between h-32 shadow-lg text-left relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-200 relative z-10 font-mono">Salespulse Mobile First</span>
                <div className="relative z-10">
                  <div className="text-3xl font-display font-bold text-white flex items-baseline gap-2">
                    1m 45s
                    <span className="bg-[#cbdbf5] text-[#003ec7] text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex leading-none -translate-y-1">
                      ↓ 55%
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-100 font-semibold uppercase mt-0.5">avg preparation period per active lead</p>
                </div>
              </div>
            </div>

            {/* target personas and priority matrix */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Personas */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h3 className="font-display text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Target Personas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-[#f8f9ff] font-bold text-xs uppercase flex items-center justify-center shrink-0 border border-slate-200 text-[#003ec7]">
                      R
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Rohan</h4>
                      <div className="text-[9px] font-bold text-primary tracking-wide uppercase">Field Sales Rep</div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">Needs instant context before walking into client meetings. Fights with clunky mobile interfaces.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-[#f8f9ff] font-bold text-xs uppercase flex items-center justify-center shrink-0 border border-slate-200 text-[#003ec7]">
                      K
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Karan</h4>
                      <div className="text-[9px] font-bold text-primary tracking-wide uppercase font-sans">Sales Manager</div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">Requires real-time visibility into team activity without badgering reps for manual updates.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority MOSCOW */}
              <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                <h3 className="font-display text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Priorities (MoSCoW)</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#eff4ff] border-l-4 border-l-primary rounded p-3 flex flex-col gap-1 justify-between h-20">
                    <span className="font-bold text-primary text-[10px] uppercase">Must Have</span>
                    <span className="text-[10px] font-semibold text-slate-600 block line-clamp-2">AI Account Briefs &amp; CRM Sync</span>
                  </div>
                  <div className="bg-slate-50 border-l-4 border-l-[#005471] rounded p-3 flex flex-col gap-1 justify-between h-20">
                    <span className="font-bold text-[#005471] text-[10px] uppercase">Should Have</span>
                    <span className="text-[10px] font-semibold text-slate-600 block line-clamp-2">Voice notes transcribing &amp; Routing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WABU Success compass bar */}
            <section className="bg-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="relative z-10 w-full md:w-1/2 text-left">
                <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest font-mono">North Star metrics</span>
                <h3 className="font-display text-xl font-bold mt-1 text-white">WABU Indicators</h3>
                <p className="text-xs text-slate-200 mt-2 font-sans font-medium line-clamp-3">
                  Weekly Active Buying Users. We track usage not by logins, but by actions that directly influence revenue generation (e.g., logging a call, reviewing an AI brief, advancing a stage).
                </p>
              </div>
              <div className="relative z-10 w-full md:w-1/3 flex items-center justify-center">
                {/* WABU circle indicators */}
                <div className="w-28 h-24 rounded-full border-4 border-[#eff4ff] flex items-center justify-center flex-col shadow-xl bg-primary/20 backdrop-blur-sm">
                  <span className="text-2xl font-bold text-white leading-none">85%</span>
                  <span className="text-[9px] font-bold text-slate-200 uppercase tracking-wide mt-1">target WABU</span>
                </div>
              </div>
              {/* Background ambient pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#dde1ff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            </section>
          </motion.div>
        ) : (
          /* Feedback star submissions Screen 10 layout */
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div className="text-left font-sans select-none max-w-md">
              <h3 className="text-lg font-bold text-slate-900">Feedback &amp; Support</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">We value your input to make SalesPulse better.</p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-5">
              {/* Star controls widget */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
                <label className="block text-sm font-bold text-slate-900 mb-1 leading-none">Overall Satisfaction</label>
                <p className="text-xs text-slate-400 font-medium mb-4">How would you rate your experience with SalesPulse?</p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className={`text-slate-300 hover:text-yellow-400 duration-150 cursor-pointer outline-none relative hover:scale-110 active:scale-95`}
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= starRating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback type tabs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
                <label className="block text-sm font-bold text-slate-900 mb-4 leading-none">Feedback Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label
                    onClick={() => setFeedbackType("bug")}
                    className={`relative flex items-center p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${
                      fbType === "bug" ? "border-primary bg-[#eff4ff]" : "border-slate-200"
                    }`}
                  >
                    <input className="sr-only" name="category" type="radio" value="bug" />
                    <Bug className="text-primary w-5 h-5 mr-3" />
                    <span className="text-xs font-semibold text-slate-800">Bug Report</span>
                  </label>

                  <label
                    onClick={() => setFeedbackType("feature")}
                    className={`relative flex items-center p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${
                      fbType === "feature" ? "border-primary bg-[#eff4ff]" : "border-slate-200"
                    }`}
                  >
                    <input className="sr-only" name="category" type="radio" value="feature" />
                    <Lightbulb className="text-primary w-5 h-5 mr-3" />
                    <span className="text-xs font-semibold text-slate-800">Feature Request</span>
                  </label>

                  <label
                    onClick={() => setFeedbackType("general")}
                    className={`relative flex items-center p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${
                      fbType === "general" ? "border-primary bg-[#eff4ff]" : "border-slate-200"
                    }`}
                  >
                    <input className="sr-only" name="category" type="radio" value="general" />
                    <MessageSquare className="text-primary w-5 h-5 mr-3" />
                    <span className="text-xs font-semibold text-slate-800">General</span>
                  </label>
                </div>
              </div>

              {/* Comment text area */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
                <label className="block text-sm font-bold text-slate-900 mb-1 leading-none" htmlFor="commentsText">Your Comments</label>
                <p className="text-xs text-slate-400 font-medium mb-4">Please provide details to help us understand.</p>
                <textarea
                  className="w-full rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs text-slate-800 bg-slate-50 p-4 placeholder:text-slate-450 transition-colors outline-none leading-relaxed"
                  id="commentsText"
                  name="comments"
                  placeholder="Describe your active experience or suggestion..."
                  rows={5}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="h-12 px-6 bg-primary hover:bg-[#0032a3] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center min-w-[140px] cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: ADD PERSONNEL USER OVERLAY ================= */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddUserOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative border border-slate-100 z-10"
            >
              <div className="bg-slate-950 text-white p-5 text-left">
                <h3 className="font-display text-base font-bold">Register Active Personnel</h3>
                <p className="text-xs opacity-80">Grant authentication credentials dynamically</p>
              </div>
              <form onSubmit={handleAddPerson} className="p-6 flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    required
                    placeholder="E.g., David Ross"
                    className="w-full border border-slate-200 p-3 rounded-lg text-xs"
                    type="text"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Role Assignation</label>
                  <select
                    className="border border-slate-200 p-3 rounded-lg text-xs bg-white outline-none"
                    value={newPersonRole}
                    onChange={(e) => setNewPersonRole(e.target.value)}
                  >
                    <option>SDR</option>
                    <option>Account Exec</option>
                    <option>VP Sales</option>
                    <option>RevOps</option>
                    <option>Sales Manager</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="text-slate-500 font-semibold text-xs py-2 px-4 hover:bg-slate-50 rounded-lg cursor-pointer animate-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-950 hover:bg-black text-white font-semibold text-xs py-3 px-5 rounded-lg shadow-md cursor-pointer"
                  >
                    Add Personnel Partner
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
