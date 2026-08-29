"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type RadarDataItem = {
  subject: string;
  readiness: number;
  fullMark?: number;
};

type CompetencyRadarProps = {
  data: RadarDataItem[];
  title?: string;
};

export function CompetencyRadar({ data, title }: CompetencyRadarProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-on-surface-variant">
        No domain competency data available
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h3 className="mb-2 text-sm font-semibold text-on-surface">{title}</h3>}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#5a413a", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
            />
            <Radar
              name="Readiness (%)"
              dataKey="readiness"
              stroke="#F4511E"
              fill="#F4511E"
              fillOpacity={0.4}
            />
            <Tooltip
              formatter={(val: any) => [`${val}%`, "Readiness"]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
