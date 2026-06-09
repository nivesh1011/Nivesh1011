/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface Task {
  id: string;
  text: string;
  time: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
  status: "Hot" | "Active" | "Completed" | "Pending";
  source: string;
}

export interface Integration {
  id: string;
  name: string;
  connected: boolean;
  category: "Calendar" | "CRM";
  iconName: string;
  statusText: string;
}

export interface ActiveAlert {
  id: string;
  type: string;
  time: string;
  title: string;
  source: string;
  colorClass: string;
}

export interface SyncLog {
  id: string;
  name: string;
  details: string;
  time: string;
  status: "success" | "error" | "pending";
}

export interface RecentBrief {
  id: string;
  title: string;
  engine: "CLAUDE 3.5" | "GPT-4O";
  summary: string;
  time: string;
}

export interface EngineParams {
  systemPrompt: string;
  tone: string;
  maxLength: string;
  autolinkEntities: boolean;
}

export interface FeedbackSubmission {
  rating: number;
  type: "bug" | "feature" | "general";
  comments: string;
}

export interface SalesPulseSession {
  currentUser: UserProfile | null;
  tasks: Task[];
  leads: Lead[];
  integrations: Integration[];
  alerts: ActiveAlert[];
  syncLogs: SyncLog[];
  recentBriefs: RecentBrief[];
  engineParams: EngineParams;
  feedbackEntries: FeedbackSubmission[];
}

export type ActiveTab = "home" | "leads" | "pipeline" | "admin" | "strategy" | "feedback";
export type AuthScreen = "splash" | "login" | "signup" | "reset";
