"use client";

import React from "react";
import AdminLayout from "@/components/AdminLayout";
import StatCard from "@/components/StatCard";
import { 
  Users, 
  MessageSquare, 
  Layers, 
  Radio, 
  PhoneCall, 
  AlertOctagon, 
  HardDrive,
  UserCheck,
  TrendingUp,
  FileWarning
} from "lucide-react";
import { 
  MOCK_STATS, 
  MOCK_USER_GROWTH, 
  MOCK_MESSAGES_VOLUME, 
  MOCK_PLATFORMS, 
  MOCK_ACTIVITIES 
} from "@/lib/mockData";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import Badge from "@/components/Badge";

export default function DashboardPage() {
  const COLORS = ["#06b6d4", "#3b82f6", "#10b981"];

  return (
    <AdminLayout>
      <div className="space-y-8 select-none">
        {/* Page Overview Header */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Operational Overview</h2>
          <p className="text-xs text-muted-foreground">Monitor instant statistics, activity metrics, and reported updates.</p>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            title="Total Registered Users" 
            value={MOCK_STATS.totalUsers.toLocaleString()} 
            change={MOCK_STATS.totalUsersChange} 
            icon={Users} 
          />
          <StatCard 
            title="Active Users (24h)" 
            value={MOCK_STATS.activeUsers24h.toLocaleString()} 
            change={MOCK_STATS.activeUsersChange} 
            icon={UserCheck} 
          />
          <StatCard 
            title="Messages Transferred" 
            value={MOCK_STATS.messagesToday.toLocaleString()} 
            change={MOCK_STATS.messagesTodayChange} 
            icon={MessageSquare} 
          />
          <StatCard 
            title="Active Groups" 
            value={MOCK_STATS.activeGroups.toLocaleString()} 
            change={MOCK_STATS.activeGroupsChange} 
            icon={TrendingUp} 
          />
          <StatCard 
            title="Voice & Video Calls" 
            value={MOCK_STATS.totalCallsToday.toLocaleString()} 
            change={MOCK_STATS.totalCallsChange} 
            icon={PhoneCall} 
          />
          <StatCard 
            title="System Communities" 
            value={MOCK_STATS.totalCommunities.toLocaleString()} 
            change={MOCK_STATS.totalCommunitiesChange} 
            icon={Layers} 
          />
          <StatCard 
            title="Active Moderation Items" 
            value={MOCK_STATS.reportedContent.toLocaleString()} 
            change={MOCK_STATS.reportedContentChange} 
            icon={AlertOctagon} 
          />
          <StatCard 
            title="Storage Consumption" 
            value={MOCK_STATS.storageUsed} 
            change={MOCK_STATS.storageUsedChange} 
            icon={HardDrive} 
          />
        </div>

        {/* Charts & Interactive Stats section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth Area Chart */}
          <div className="lg:col-span-2 glass p-6 rounded-xl border border-border flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-tight text-foreground">User Influx Trends</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_USER_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#121214", borderColor: "#27272a", fontSize: 11 }} />
                  <Area type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device Distribution Pie Chart */}
          <div className="glass p-6 rounded-xl border border-border flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-tight text-foreground">Platform Usage</h3>
            <div className="h-64 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_PLATFORMS}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {MOCK_PLATFORMS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#121214", borderColor: "#27272a", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Top client</span>
                <span className="text-sm font-bold text-foreground">Android (68%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages and Activity Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Volumes Bar Chart */}
          <div className="lg:col-span-1 glass p-6 rounded-xl border border-border flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-tight text-foreground">Weekly Message Counts</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_MESSAGES_VOLUME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#121214", borderColor: "#27272a", fontSize: 11 }} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Audit Logs / Activity Feed */}
          <div className="lg:col-span-2 glass p-6 rounded-xl border border-border flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-tight text-foreground">System Audit Stream</h3>
            <div className="space-y-4 overflow-y-auto max-h-[256px] pr-2">
              {MOCK_ACTIVITIES.map((act) => (
                <div key={act.id} className="flex items-start justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {act.type === "report" ? (
                        <Badge variant="danger">Report</Badge>
                      ) : act.type === "registration" ? (
                        <Badge variant="success">New User</Badge>
                      ) : act.type === "community" ? (
                        <Badge variant="info">Community</Badge>
                      ) : (
                        <Badge variant="default">Channel</Badge>
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-foreground font-semibold">
                        {act.user}{" "}
                        <span className="text-muted-foreground font-normal">{act.description}</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
