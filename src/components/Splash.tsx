/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion } from "motion/react";

interface SplashProps {
  onTransitionComplete: () => void;
}

export default function Splash({ onTransitionComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTransitionComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onTransitionComplete]);

  return (
    <div className="absolute inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Pulsing Logo Card */}
        <motion.div
          animate={{ scale: [1, 1.05, 1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 mb-6 rounded-2xl shadow-[0_8px_24px_rgba(0,62,255,0.15)] bg-white p-2 flex items-center justify-center"
        >
          <img
            alt="SalesPulse Branding logo"
            className="w-full h-full object-contain"
            src="https://lh3.googleusercontent.com/aida/AP1WRLupDBLb4PELWFEmc21U8FfU3DdBx5vx1wcOxGy96D7WolsHAmlnIGsWRkAAovGcqZAF2SnGOJA92A1TW2m_OlPRqiRfHcPOOKg2j6YZzlYGfbePCNhkeo7dqIWdFyrEMEk6I1qzl4_h5zYRPsWDShjY1eIXiHbuqRcmncadvWIEXKGG3lwIgUDwjJizegwET_E1ty9i2S5mMx5zJcYRPDHNtYeT2H2_VWBxIxikaU_1KNc_DvznIQhm3A"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl font-bold text-[#003ec7] tracking-tight"
        >
          SalesPulse
        </motion.div>

        {/* Pulse Wave Drawing */}
        <div className="mt-4 w-36 h-10 overflow-hidden flex justify-center">
          <svg
            fill="none"
            height="40"
            viewBox="0 0 140 40"
            width="140"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              d="M0 20 H40 L50 5 L70 35 L80 20 H140"
              stroke="#0052ff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Action text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xs text-slate-400 mt-6 tracking-wide uppercase font-medium"
        >
          Powering Revenue Operations...
        </motion.p>
      </div>
    </div>
  );
}
