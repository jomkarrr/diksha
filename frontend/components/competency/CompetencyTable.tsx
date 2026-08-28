import { Badge } from "@/components/ui/Badge";
import { LevelDots } from "./LevelDots";
import { competencyCatalogue, domainLabels } from "@/lib/mock/data";

export function CompetencyTable() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div>
          <h2 className="text-xl font-semibold">Detailed Matrix</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Current competency state against role requirements.</p>
        </div>
        <button className="focus-ring rounded-lg border border-[#F4511E] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#F4511E]">
          View History
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 text-on-surface-variant">
            <tr>
              <th className="label px-4 py-3">Competency</th>
              <th className="label px-4 py-3">Domain</th>
              <th className="label px-4 py-3">Current</th>
              <th className="label px-4 py-3">Required</th>
              <th className="label px-4 py-3">Gap</th>
              <th className="label px-4 py-3">Priority</th>
            </tr>
          </thead>
          <tbody>
            {competencyCatalogue.map((item) => (
              <tr key={item.node_id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-4 font-semibold">{item.name}</td>
                <td className="px-4 py-4 text-on-surface-variant">{domainLabels[item.domain]}</td>
                <td className="px-4 py-4">
                  <LevelDots current={item.current_level} />
                  <span className="mt-1 block text-xs capitalize text-on-surface-variant">{item.current_level}</span>
                </td>
                <td className="px-4 py-4 capitalize">{item.required_level}</td>
                <td className="px-4 py-4">
                  <Badge severity={item.gap_severity}>{item.gap_severity}</Badge>
                </td>
                <td className="px-4 py-4 text-on-surface-variant">{item.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
