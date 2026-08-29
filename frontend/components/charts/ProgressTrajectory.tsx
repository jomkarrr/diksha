"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type ProgressTrajectoryItem = {
  name: string;
  progress: number;
};

type ProgressTrajectoryProps = {
  data: ProgressTrajectoryItem[];
};

export function ProgressTrajectory({ data }: ProgressTrajectoryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-on-surface-variant">
        No module progress data recorded yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis
            type="number"
            domain={[0, 100]}
            unit="%"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: "#5a413a", fontSize: 11 }}
          />
          <Tooltip
            formatter={(val: any) => [`${val}%`, "Completion Progress"]}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.progress >= 75 ? "#10b981" : entry.progress >= 30 ? "#F4511E" : "#ac2d00"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
