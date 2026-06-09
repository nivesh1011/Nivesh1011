/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings, Network, Calendar, Cloud, Briefcase, Cpu, Database, Check,
  Activity, ArrowRight, Edit, AlertCircle, RefreshCw, Layers
} from "lucide-react";
import { Integration, ActiveAlert, SyncLog, RecentBrief, EngineParams } from "../types";

interface PipelineHubProps {
  integrations: Integration[];
  alerts: ActiveAlert[];
  syncLogs: SyncLog[];
  recentBriefs: RecentBrief[];
  engineParams: EngineParams;
  onToggleIntegration: (id: string) => void;
  onUpdateEngineParams: (params: EngineParams) => void;
  onLogActivity: (text: string, source: string) => void;
}

type SubPipelineTab = "flows" | "integrations" | "tuner";

export default function PipelineHub({
  integrations,
  alerts,
  syncLogs,
  recentBriefs,
  engineParams,
  onToggleIntegration,
  onUpdateEngineParams,
  onLogActivity
}: PipelineHubProps) {
  const [subTab, setSubTab] = useState<SubPipelineTab>("flows");

  // Local tuner states
  const [systemPrompt, setSystemPrompt] = useState(engineParams.systemPrompt);
  const [tone, setTone] = useState(engineParams.tone);
  const [maxLength, setMaxLength] = useState(engineParams.maxLength);
  const [autolink, setAutolink] = useState(engineParams.autolinkEntities);

  // Notifications
  const [toastMsg, setToastMsg] = useState("");

  const handleTestTuning = () => {
    onUpdateEngineParams({
      systemPrompt,
      tone,
      maxLength,
      autolinkEntities: autolink
    });

    onLogActivity("Optimized intelligence engine prompt limits (System v2.4)", "LinkedIn");
    setToastMsg("Prompt parameters updated! Dynamic compilation successful.");
    setTimeout(() => {
      setToastMsg("");
    }, 2800);
  };

  return (
    <div className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 select-none relative">
      {/* Toast popup */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-55 bg-indigo-900 border border-indigo-700 shadow-2xl rounded-xl p-4 flex items-center gap-3 text-white max-w-sm"
          >
            <Check className="w-5 h-5 text-emerald-400 stroke-[3px]" />
            <span className="text-xs font-semibold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Pipeline Control Room</h2>
          <p className="text-sm text-slate-500 font-medium">Manage streams, integrations, and LLM tuning engines.</p>
        </div>

        {/* Top Hub Navigation Switches */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-[#c3c5d9]/20 self-start">
          <button
            onClick={() => setSubTab("flows")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === "flows" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Data Aggregator
          </button>
          <button
            onClick={() => setSubTab("integrations")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === "integrations" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Services Hub
          </button>
          <button
            onClick={() => setSubTab("tuner")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              subTab === "tuner" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Intelligence Tuning
          </button>
        </div>
      </div>

      {/* Subtab Router content */}
      <AnimatePresence mode="wait">
        {subTab === "flows" ? (
          <motion.div
            key="flows"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Active Data Flows Wide Card (Screen 7 layout) */}
            <section className="bg-white border border-[#c3c5d9]/30 rounded-2xl shadow-sm p-4 md:p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Network className="w-5 h-5 text-primary animate-pulse" />
                  Active Stream Flows
                </h3>
                <span className="bg-blue-50 text-primary px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary data-flow-pulse" /> Live feeds (99.9%)
                </span>
              </div>

              {/* Data Flow Sources Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Source 1 */}
                <div className="bg-[#eff4ff] border border-slate-100 hover:border-blue-200 hover:shadow transition-all rounded-xl p-4 flex flex-col justify-between h-32">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                      <Network className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">24MS PING</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">NewsAPI</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Global PR & regulatory triggers</p>
                  </div>
                </div>

                {/* Source 2 */}
                <div className="bg-[#eff4ff] border border-slate-100 hover:border-blue-200 hover:shadow transition-all rounded-xl p-4 flex flex-col justify-between h-32">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">42MS PING</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Crunchbase Alerts</h4>
                    <p className="text-[10px] text-slate-500 font-medium font-sans">Cap Table & rounds monitoring</p>
                  </div>
                </div>

                {/* Source 3 */}
                <div className="bg-[#eff4ff] border border-slate-100 hover:border-blue-200 hover:shadow transition-all rounded-xl p-4 flex flex-col justify-between h-32">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">18MS PING</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">LinkedIn Scrapers</h4>
                    <p className="text-[10px] text-slate-500 font-medium">VP changes & staff relocations</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Down Layout: Sync Logs & Triggered Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sync table logs */}
              <section className="md:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-200 bg-[#f8f9ff]">
                  <h3 className="font-display text-sm font-bold text-slate-900">Recent Sync Registry</h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {syncLogs.map((log) => (
                    <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${log.status === "pending" ? "animate-spin text-red-500" : ""}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{log.name}</p>
                          <p className={`text-[10px] font-semibold ${log.status === "error" ? "text-red-500" : "text-slate-400"}`}>
                            {log.details}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Active Alerts column widget */}
              <section className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-display text-sm font-bold text-slate-900">Triggered Active Alerts</h3>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-[#eff4ff] border-l-4 border-[#0052ff] rounded-r-xl p-3 flex flex-col gap-1 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-[#003ec7] tracking-wider uppercase font-mono">{alert.type}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{alert.time}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{alert.title}</p>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{alert.source}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        ) : subTab === "integrations" ? (
          /* Integrations Screen 5 content */
          <motion.div
            key="integrations"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-slate-900">Connections Hub</h3>
              <p className="text-xs text-slate-500">Enable bidirectional pipelines with your corporate sales tech stack.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category calendar */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Calendar Providers</h4>
                {integrations
                  .filter((i) => i.category === "Calendar")
                  .map((integ) => (
                    <div
                      key={integ.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary group-hover:bg-[#e5eeff] transition-colors border border-slate-100">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-900 block">{integ.name}</span>
                          <span className="inline-flex items-center gap-1.5 mt-0.5">
                            <span className={`w-2 h-2 rounded-full ${integ.connected ? "bg-emerald-500" : "bg-slate-300"}`} />
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">
                              {integ.connected ? "Connected" : "Disabled"}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Switched toggles */}
                      <button
                        onClick={() => onToggleIntegration(integ.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer outline-none ${
                          integ.connected ? "bg-primary" : "bg-slate-200"
                        }`}
                      >
                        <motion.span
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md ${
                            integ.connected ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
              </div>

              {/* CRMs */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">CRM Registries</h4>
                <div className="flex flex-col gap-3">
                  {integrations
                    .filter((i) => i.category === "CRM")
                    .map((integ) => {
                      const getIcon = () => {
                        if (integ.name === "Salesforce") return <Cloud className="w-6 h-6 text-[#00a1e0]" />;
                        if (integ.name === "HubSpot") return <Network className="w-6 h-6 text-[#ff7a59]" />;
                        return <Briefcase className="w-6 h-6 text-teal-600" />;
                      };
                      return (
                        <div
                          key={integ.id}
                          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-100">
                              {getIcon()}
                            </div>
                            <div className="text-left">
                              <span className="text-xs font-bold text-slate-900 block">{integ.name}</span>
                              <span className="inline-flex items-center gap-1.5 mt-0.5">
                                <span className={`w-2 h-2 rounded-full ${integ.connected ? "bg-emerald-500" : "bg-slate-300"}`} />
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                  {integ.connected ? "Connected" : "Disabled"}
                                </span>
                              </span>
                            </div>
                          </div>

                          {/* Toggle */}
                          <button
                            onClick={() => onToggleIntegration(integ.id)}
                            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer outline-none ${
                              integ.connected ? "bg-primary" : "bg-slate-200"
                            }`}
                          >
                            <motion.span
                              layout
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md ${
                                integ.connected ? "right-1" : "left-1"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Intelligence Tuning config Screen 6 content */
          <motion.div
            key="tuner"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* System health row widgets */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Health Box */}
              <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Uptime Indicators</h4>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-primary">99.9%</div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">uptime (last 30 days)</span>
                </div>
              </div>

              {/* Claude 3.5 Usage */}
              <div className="md:col-span-4 bg-white border-l-[3.5px] border-l-primary border-y border-r border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-slate-800">Claude 3.5 Sonnet</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">primary</span>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-[10px] font-bold tracking-wide uppercase text-slate-500">
                    <span>Context Window</span>
                    <span className="text-slate-900">45%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>

              {/* GPT-4o Standby */}
              <div className="md:col-span-4 bg-white border-l-[3.5px] border-l-slate-400 border-y border-r border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[140px] opacity-90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-800">GPT-4o routing</span>
                  </div>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">standby</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-3">
                  Routes requests dynamically if primary engine encounters latency peaks or exceeds tier limits.
                </p>
              </div>
            </section>

            {/* Prompt Tuning settings and list of recent briefs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Tuner panel left */}
              <section className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-display text-sm font-bold text-slate-900">Base Tuning Params</h3>
                  <span className="bg-blue-50 text-[#0052ff] text-[10px] font-bold py-0.5 px-2 rounded-md uppercase">V2.4 stable</span>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700">Base System Prompt</label>
                      <button className="text-primary hover:text-primary-hover">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      className="border border-slate-200 rounded-lg p-3 text-xs w-full font-semibold text-slate-500 bg-slate-50 focus:bg-white focus:border-primary shrink-0 transition-colors outline-none leading-relaxed"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700">Tone Settings</label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none cursor-pointer"
                      >
                        <option>Direct & Actionable</option>
                        <option>Comprehensive Analysis</option>
                        <option>Executive Brief rollup</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700">Max Length</label>
                      <select
                        value={maxLength}
                        onChange={(e) => setMaxLength(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none cursor-pointer"
                      >
                        <option>300 words</option>
                        <option>500 words</option>
                        <option>Unlimited density</option>
                      </select>
                    </div>
                  </div>

                  {/* Toggle checklist autolink */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold text-slate-700">Auto-link CRM Entities</span>
                    <button
                      type="button"
                      onClick={() => setAutolink(!autolink)}
                      className={`relative w-10 h-6.5 rounded-full transition-colors cursor-pointer outline-none ${
                        autolink ? "bg-primary" : "bg-slate-200"
                      }`}
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow ${
                          autolink ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    onClick={handleTestTuning}
                    className="w-full text-center bg-primary hover:bg-[#0032a3] text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer"
                  >
                    Test Tuned Configuration
                  </button>
                </div>
              </section>

              {/* Brief outputs summaries on right */}
              <section className="md:col-span-5 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-display text-sm font-bold text-slate-900">Recent AI Briefs</h3>
                </div>
                <div className="space-y-3">
                  {recentBriefs.map((brief) => (
                    <div
                      key={brief.id}
                      className="bg-white border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer shadow-sm rounded-xl p-4 flex gap-3 text-left group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 font-bold text-xs uppercase flex items-center justify-center shrink-0 border border-slate-100">
                        {brief.title.slice(0, 2)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold text-slate-950 block truncate">{brief.title}</span>
                          <span className="text-[9px] font-bold py-0.5 px-1.5 bg-slate-100 text-slate-500 rounded font-mono">
                            {brief.engine}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{brief.summary}</p>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1.5">{brief.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
