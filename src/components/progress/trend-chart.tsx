"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS: Record<string, string> = { listening: "#2563eb", reading: "#059669", writing: "#d97706", speaking: "#7c3aed", language_elements: "#db2777" };
const LABELS: Record<string, string> = { listening: "Listening", reading: "Reading", writing: "Writing", speaking: "Speaking", language_elements: "Language elements" };

export function TrendChart({ points }: { points: { date: string; attemptId: string; skill: string; percent: number }[] }) {
  const byAttempt = new Map<string, Record<string, number | string>>();
  for (const p of points) {
    const row = byAttempt.get(p.attemptId) ?? { date: new Date(p.date).toLocaleDateString(undefined, { day: "numeric", month: "short" }) };
    row[p.skill] = p.percent;
    byAttempt.set(p.attemptId, row);
  }
  const data = [...byAttempt.values()];
  const skills = [...new Set(points.map((p) => p.skill))];
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis domain={[0, 100]} unit="%" fontSize={12} />
          <Tooltip formatter={(v) => `${v ?? "—"}%`} />
          <Legend />
          {skills.map((s) => <Line key={s} type="monotone" dataKey={s} name={LABELS[s] ?? s} stroke={COLORS[s] ?? "#64748b"} strokeWidth={2} connectNulls dot />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
