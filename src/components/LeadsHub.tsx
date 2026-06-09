/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Award, ShieldAlert, CheckCircle, Clock, Trash2, Home, Landmark, UserMinus } from "lucide-react";
import { Lead } from "../types";

interface LeadsHubProps {
  leads: Lead[];
  selectedLead: Lead | null;
  onSelectLead: (lead: Lead | null) => void;
  onUpdateLeadStatus: (id: string, status: "Active" | "Hot" | "Pending" | "Completed") => void;
  onDeleteLead: (id: string) => void;
}

export default function LeadsHub({
  leads,
  selectedLead,
  onSelectLead,
  onUpdateLeadStatus,
  onDeleteLead
}: LeadsHubProps) {
  const [filterType, setFilterType] = useState<"all" | "highIntent">("all");
  const [leadSearch, setLeadSearch] = useState("");
  const [sortField, setSortField] = useState<"score" | "name">("score");

  // Filtering logic
  const filteredLeads = leads.filter((lead) => {
    // High intent threshold: score >= 85
    if (filterType === "highIntent" && lead.score < 85) return false;
    
    // Search filter
    if (leadSearch.trim() !== "") {
      const query = leadSearch.toLowerCase();
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.source.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Sorting
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortField === "score") {
      return b.score - a.score; // high to low
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex-grow w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Generated Leads</h2>
        <p className="text-sm text-slate-500 font-medium">Review and triage your latest automated captures.</p>
      </div>

      {/* Filter / Utility headers */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 select-none text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Search leads, enterprise names, or sources..."
            type="text"
            value={leadSearch}
            onChange={(e) => setLeadSearch(e.target.value)}
          />
        </div>

        {/* Tab filters and Sort toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all ${
                filterType === "all"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Active ({leads.filter(l => l.status !== "Completed").length})
            </button>
            <button
              onClick={() => setFilterType("highIntent")}
              className={`text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all ${
                filterType === "highIntent"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              High Intent (Score 85+)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:block">Sort By</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="border border-slate-200 rounded-lg p-2 text-xs bg-white cursor-pointer select-none text-slate-700 outline-none"
            >
              <option value="score">Intent Score</option>
              <option value="name">Full Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Cards Grid representing Screen 9 */}
      <div className="flex flex-col gap-4">
        {sortedLeads.length === 0 ? (
          <div className="text-center text-slate-400 text-xs py-16 bg-white rounded-xl border border-slate-100">
            No leads match your active filters. Try adding a new lead!
          </div>
        ) : (
          <AnimatePresence>
            {sortedLeads.map((lead) => {
              const isHot = lead.status === "Hot";
              const isCompleted = lead.status === "Completed";
              const isPending = lead.status === "Pending";

              return (
                <motion.article
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Visual Status Indicator strip */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[4px] ${
                      isCompleted
                        ? "bg-slate-300"
                        : isHot
                        ? "bg-emerald-500"
                        : isPending
                        ? "bg-amber-400"
                        : "bg-primary"
                    }`}
                  />

                  {/* Top content row */}
                  <div className="flex justify-between items-start w-full pl-2">
                    <div className="flex flex-col gap-1.5 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-bold text-slate-800">{lead.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-primary border border-blue-100 uppercase tracking-wide">
                          {lead.source}
                        </span>
                        {isCompleted && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wider">
                            completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 font-semibold uppercase tracking-wide">
                        <Landmark className="w-4 h-4 text-slate-400" />
                        {lead.company}
                      </p>
                    </div>

                    {/* Score Badge widget */}
                    <div className="bg-[#f8f9ff] border border-slate-200 rounded-xl p-2 text-center min-w-[64px] shadow-sm">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        score
                      </span>
                      <span
                        className={`block font-display text-base font-bold leading-none ${
                          lead.score >= 85 ? "text-emerald-600" : "text-[#0052ff]"
                        }`}
                      >
                        {lead.score}
                      </span>
                    </div>
                  </div>

                  {/* Actions Section footer matching mockup precisely */}
                  <div className="flex items-center justify-end gap-2 mt-1 pt-3 border-t border-slate-100 pl-2">
                    {/* Pending state toggle */}
                    <button
                      onClick={() => onUpdateLeadStatus(lead.id, "Pending")}
                      className={`flex items-center justify-center gap-1.5 h-11 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer outline-none ${
                        isPending
                          ? "bg-amber-500/10 text-amber-700 border-amber-300"
                          : "bg-white hover:bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="hidden sm:inline">Set Pending</span>
                    </button>

                    {/* Accept / Complete toggle */}
                    <button
                      onClick={() =>
                        onUpdateLeadStatus(lead.id, isCompleted ? "Active" : "Completed")
                      }
                      className={`flex items-center justify-center gap-1.5 h-11 px-4 rounded-lg border text-xs font-bold transition-all cursor-pointer outline-none ${
                        isCompleted
                          ? "bg-emerald-600 text-white border-emerald-600 shadow"
                          : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isCompleted ? "Completed" : "Accept Lead"}</span>
                    </button>

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    {/* Delete lead block */}
                    <button
                      onClick={() => onDeleteLead(lead.id)}
                      className="w-11 h-11 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-700 transition-colors cursor-pointer outline-none"
                      aria-label="Delete Lead Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
