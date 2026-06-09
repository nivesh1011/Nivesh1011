/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="bg-[#f8f9ff] min-h-screen pb-24 font-sans antialiased text-[#0b1c30]">
      {/* TopAppBar Skeleton */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm flex justify-between items-center w-full px-4 h-16 border-b border-[#c3c5d9]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 shimmer" />
          <h1 className="font-display text-xl font-bold text-primary tracking-tight">SalesPulse</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 shimmer" />
      </header>

      {/* Main Content Layout */}
      <main className="px-4 py-6 space-y-8 max-w-5xl mx-auto w-full">
        {/* Welcome Banner Skeleton */}
        <section className="space-y-2 opacity-80">
          <div className="shimmer h-8 w-48 rounded-lg" />
          <div className="shimmer h-4 w-32 rounded-md" />
        </section>

        {/* Bento Grid layout */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 flex flex-row md:flex-col gap-3 overflow-hidden">
            <div className="bg-white border border-[#c3c5d9]/30 rounded-xl p-4 shadow-[0_4px_12px_rgba(10,25,47,0.02)] min-w-[140px] flex-1">
              <div className="shimmer h-4 w-12 rounded mb-6" />
              <div className="shimmer h-8 w-20 rounded-lg" />
            </div>
            <div className="bg-white border border-[#c3c5d9]/30 rounded-xl p-4 shadow-[0_4px_12px_rgba(10,25,47,0.02)] min-w-[140px] flex-1">
              <div className="shimmer h-4 w-16 rounded mb-6" />
              <div className="shimmer h-8 w-24 rounded-lg" />
            </div>
          </div>

          {/* Sales Overview Chart Skeleton */}
          <div className="md:col-span-2 bg-white border border-[#c3c5d9]/30 rounded-xl p-4 shadow-[0_4px_12px_rgba(10,25,47,0.03)] h-72 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="shimmer h-5 w-32 rounded" />
              <div className="shimmer h-6 w-16 rounded-full" />
            </div>

            {/* Simulated bar outlines */}
            <div className="flex-1 flex justify-between items-end gap-2 px-2">
              <div className="shimmer w-full rounded-t-lg h-[30%] opacity-50" />
              <div className="shimmer w-full rounded-t-lg h-[50%] opacity-50" />
              <div className="shimmer w-full rounded-t-lg h-[40%] opacity-50" />
              <div className="shimmer w-full rounded-t-lg h-[80%] opacity-70" />
              <div className="shimmer w-full rounded-t-lg h-[60%] opacity-50" />
              <div className="shimmer w-full rounded-t-lg h-[90%] opacity-80" />
            </div>
            <div className="h-px w-full bg-slate-200 mt-2" />
          </div>
        </section>

        {/* Recent Leads Skeleton list */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="shimmer h-6 w-36 rounded-md" />
            <div className="shimmer h-4 w-12 rounded" />
          </div>
          <div className="bg-white border border-[#c3c5d9]/30 rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.02)] divide-y divide-[#c3c5d9]/10">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 flex items-center space-x-4">
                <div className="shimmer w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="shimmer h-4 rounded w-1/3" />
                  <div className="shimmer h-3 rounded w-1/4" />
                </div>
                <div className="shimmer w-8 h-8 rounded-full border border-slate-100" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
