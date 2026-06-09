/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ArrowLeft } from "lucide-react";
import { UserProfile } from "../types";

interface AuthPagesProps {
  currentScreen: "login" | "signup" | "reset";
  setScreen: (screen: "login" | "signup" | "reset") => void;
  onLoginSuccess: (userProfile: UserProfile) => void;
}

export default function AuthPages({ currentScreen, setScreen, onLoginSuccess }: AuthPagesProps) {
  // Input fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Errors / Notifications
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Registered user simulations
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([
    { name: "Alex Jenkins", email: "alex@salespulse.com", role: "VP Sales" },
    { name: "Sarah Jenkins", email: "sarah@salespulse.com", role: "VP Sales" }
  ]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Full name is required");
      return;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setErrorMsg("Please enter a valid work email address");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    // Success simulation
    const newUser: UserProfile = {
      name: fullName,
      email: email,
      role: "Sales Rep"
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setSuccessMsg("Account created successfully! Redirecting to login...");
    
    setTimeout(() => {
      setScreen("login");
      setSuccessMsg("");
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("All credentials are required");
      return;
    }

    // Direct bypass or custom verification
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    const userToLogin: UserProfile = foundUser || {
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email,
      role: "Sales Executive"
    };

    setSuccessMsg(`Welcome back, ${userToLogin.name}! Logging in...`);
    setTimeout(() => {
      onLoginSuccess(userToLogin);
    }, 1200);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setSuccessMsg("Reset link has been transmitted to your email!");
    setTimeout(() => {
      setScreen("login");
      setSuccessMsg("");
    }, 2000);
  };

  const handleGoogleAuth = () => {
    setErrorMsg("");
    setSuccessMsg("Connecting with Secure Google Accounts...");
    setTimeout(() => {
      onLoginSuccess({
        name: "Alex",
        email: "alex.pro@salespulse.com",
        role: "Enterprise Leader"
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex w-full text-slate-900 bg-[#f8f9ff] selection:bg-[#0052ff]/20 selection:text-[#003ec7]">
      <AnimatePresence mode="wait">
        {currentScreen === "signup" ? (
          <motion.div
            key="signup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex"
          >
            {/* Left Brand Panel (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#dce9ff] overflow-hidden items-center justify-center p-8">
              <img
                alt="Office Dashboard Background"
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa4bII_4Mayw24RS7MrqINYpSCeRo8XgnSWYJaRsdYWoZCMzuhmyVnwc8nKXRyawKrkaWULyvIAiAT6slsoFVJPmZ4s2w6TC7IGXd0PMJJM_2X88D1Soa7OcJo32g6M6TyxwQFpi9EyVArzqKSNq0EZ7Z-VlHX6T9fbO0IHjYv6aMZoE7lYRfNmwrOVbXYLXd1A8txvMcUcqUGS1zZ4fExAzCk4K7HgqJ3d06TzOXC2ei6Phjb8ckXsUd92lfZI5zgYYEmPKG0aBU"
              />
              <div className="relative z-10 max-w-lg text-center flex flex-col items-center">
                <div className="w-24 h-24 mb-6 rounded-2xl shadow-[0_4px_12px_rgba(10,25,47,0.08)] bg-white flex items-center justify-center p-2 overflow-hidden">
                  <img
                    alt="SalesPulse Branding logo shadow"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida/AP1WRLupDBLb4PELWFEmc21U8FfU3DdBx5vx1wcOxGy96D7WolsHAmlnIGsWRkAAovGcqZAF2SnGOJA92A1TW2m_OlPRqiRfHcPOOKg2j6YZzlYGfbePCNhkeo7dqIWdFyrEMEk6I1qzl4_h5zYRPsWDShjY1eIXiHbuqRcmncadvWIEXKGG3lwIgUDwjJizegwET_E1ty9i2S5mMx5zJcYRPDHNtYeT2H2_VWBxIxikaU_1KNc_DvznIQhm3A"
                  />
                </div>
                <h1 className="font-display text-4xl font-bold text-[#0b1c30] mb-4">
                  Drive your revenue forward.
                </h1>
                <p className="text-base text-[#434656] max-w-md">
                  Equip your high-performing sales team with the precise tools they need to close
                  deals faster and manage pipeline efficiently.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent pointer-events-none" />
            </div>

            {/* Right Screen Panel signup */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-8 md:px-8 relative bg-white">
              <div className="w-full max-w-md p-6 bg-white sm:border sm:border-slate-100 sm:shadow-lg sm:rounded-2xl">
                <div className="flex flex-col items-center sm:items-start mb-6">
                  <img
                    alt="SalesPulse Logo"
                    className="h-12 w-12 rounded-xl mb-4 shadow-sm lg:hidden hover:scale-105 duration-200"
                    src="https://lh3.googleusercontent.com/aida/AP1WRLupDBLb4PELWFEmc21U8FfU3DdBx5vx1wcOxGy96D7WolsHAmlnIGsWRkAAovGcqZAF2SnGOJA92A1TW2m_OlPRqiRfHcPOOKg2j6YZzlYGfbePCNhkeo7dqIWdFyrEMEk6I1qzl4_h5zYRPsWDShjY1eIXiHbuqRcmncadvWIEXKGG3lwIgUDwjJizegwET_E1ty9i2S5mMx5zJcYRPDHNtYeT2H2_VWBxIxikaU_1KNc_DvznIQhm3A"
                  />
                  <h2 className="font-display text-2xl font-bold text-[#0b1c30] tracking-tight">
                    Create an account
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Join SalesPulse to accelerate your growth.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 mb-4 transition-all">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-100 mb-4 transition-all">
                    {successMsg}
                  </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="regName">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-5 h-5 text-slate-400" />
                      <input
                        className="h-[48px] w-full pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] focus:outline-none transition-all outline-none"
                        id="regName"
                        placeholder="Jane Doe"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="regEmail">
                      Work Email
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-5 h-5 text-slate-400" />
                      <input
                        className="h-[48px] w-full pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] focus:outline-none transition-all outline-none"
                        id="regEmail"
                        placeholder="jane@company.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="regPassword">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-5 h-5 text-slate-400" />
                      <input
                        className="h-[48px] w-full pl-10 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] focus:outline-none transition-all outline-none"
                        id="regPassword"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="regConfirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-5 h-5 text-slate-400" />
                      <input
                        className="h-[48px] w-full pl-10 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0052ff] focus:ring-1 focus:ring-[#0052ff] focus:outline-none transition-all outline-none"
                        id="regConfirmPassword"
                        placeholder="••••••••"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      className="h-[48px] w-full bg-primary hover:bg-[#0032a3] text-white text-xs font-semibold rounded-lg shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 duration-100"
                      type="submit"
                    >
                      Sign Up
                    </button>
                    <button
                      className="h-[48px] w-full border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 duration-100"
                      type="button"
                      onClick={handleGoogleAuth}
                    >
                      Sign up with Google
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500">
                    Already have an account?{" "}
                    <button
                      className="font-bold text-primary hover:underline transition-all cursor-pointer"
                      onClick={() => setScreen("login")}
                    >
                      Log In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : currentScreen === "reset" ? (
          <motion.div
            key="reset"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex items-center justify-center p-4 relative"
          >
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#c3c5d9_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0052ff]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

            <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative z-10">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-primary" />
              <div className="p-8 flex flex-col items-center">
                <div className="mb-6 w-full flex justify-center">
                  <img
                    alt="SalesPulse Logo"
                    className="h-16 w-16 object-contain rounded-xl shadow-sm"
                    src="https://lh3.googleusercontent.com/aida/AP1WRLupDBLb4PELWFEmc21U8FfU3DdBx5vx1wcOxGy96D7WolsHAmlnIGsWRkAAovGcqZAF2SnGOJA92A1TW2m_OlPRqiRfHcPOOKg2j6YZzlYGfbePCNhkeo7dqIWdFyrEMEk6I1qzl4_h5zYRPsWDShjY1eIXiHbuqRcmncadvWIEXKGG3lwIgUDwjJizegwET_E1ty9i2S5mMx5zJcYRPDHNtYeT2H2_VWBxIxikaU_1KNc_DvznIQhm3A"
                  />
                </div>

                <div className="text-center mb-6 w-full">
                  <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">
                    Reset Password
                  </h1>
                  <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                    Enter your email to receive a password reset link
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 mb-4 w-full">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-100 mb-4 w-full">
                    {successMsg}
                  </div>
                )}

                <form className="w-full flex flex-col gap-6" onSubmit={handleResetPassword}>
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-slate-700 font-semibold" htmlFor="resetEmail">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        className="w-full h-[48px] pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-950 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all outline-none"
                        id="resetEmail"
                        placeholder="name@company.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mt-2 w-full">
                    <button
                      className="w-full h-[48px] bg-primary hover:bg-[#0032a3] text-white rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-100"
                      type="submit"
                    >
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      className="w-full h-[48px] flex items-center justify-center gap-2 text-primary hover:text-[#0032a3] transition-colors group cursor-pointer"
                      type="button"
                      onClick={() => setScreen("login")}
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-xs font-semibold">Back to Login</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Login Screen */
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full bg-[#f8f9ff] flex flex-col items-center justify-center px-4 py-8 relative min-h-screen"
          >
            <div className="w-full max-w-md bg-white border border-slate-100 shadow-xl rounded-2xl p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-[#0052ff]" />
              <div className="flex flex-col items-center mb-6">
                <img
                  alt="SalesPulse Logo"
                  className="h-14 w-14 object-contain rounded-xl shadow-sm mb-4"
                  src="https://lh3.googleusercontent.com/aida/AP1WRLupDBLb4PELWFEmc21U8FfU3DdBx5vx1wcOxGy96D7WolsHAmlnIGsWRkAAovGcqZAF2SnGOJA92A1TW2m_OlPRqiRfHcPOOKg2j6YZzlYGfbePCNhkeo7dqIWdFyrEMEk6I1qzl4_h5zYRPsWDShjY1eIXiHbuqRcmncadvWIEXKGG3lwIgUDwjJizegwET_E1ty9i2S5mMx5zJcYRPDHNtYeT2H2_VWBxIxikaU_1KNc_DvznIQhm3A"
                />
                <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
                <p className="text-xs text-slate-500">Enter your credentials to access your dashboard.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 mb-4">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-100 mb-4">
                  {successMsg}
                </div>
              )}

              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700 font-sans" htmlFor="loginEmail">
                    Work Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-5 h-5 text-slate-400" />
                    <input
                      className="w-full h-[48px] pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-950 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all outline-none"
                      id="loginEmail"
                      placeholder="name@company.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700 font-sans" htmlFor="loginPassword">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-5 h-5 text-slate-400" />
                    <input
                      className="w-full h-[48px] pl-10 pr-12 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-950 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all outline-none"
                      id="loginPassword"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      className="w-4 h-4 rounded border-slate-200 focus:ring-primary text-primary transition-all cursor-pointer"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    className="text-xs text-primary font-semibold hover:underline"
                    type="button"
                    onClick={() => setScreen("reset")}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    className="w-full h-[48px] bg-primary hover:bg-[#0032a3] text-white rounded-lg text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                    type="submit"
                  >
                    Login
                  </button>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="flex-shrink-0 px-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      or
                    </span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>
                  <button
                    className="w-full h-[48px] bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 active:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    type="button"
                    onClick={handleGoogleAuth}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.09H2.18V16.93C3.99 20.53 7.7 23 12 23Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09C5.62 13.43 5.5 12.73 5.5 12C5.5 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.84 14.09Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07L5.84 9.91C6.71 7.3 9.14 5.38 12 5.38Z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google Accounts
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <span className="text-xs text-slate-500">New User? </span>
                <button
                  className="font-bold text-primary hover:underline transition-colors cursor-pointer"
                  onClick={() => setScreen("signup")}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
