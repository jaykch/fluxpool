import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Lock, Unlock } from "lucide-react";

// Mock vesting data: each entry is a period (e.g., month) with unlocked and locked amounts
const vestingSchedule = [
  { period: "Jan 2024", unlocked: 1000, locked: 4000 },
  { period: "Feb 2024", unlocked: 2000, locked: 3000 },
  { period: "Mar 2024", unlocked: 3000, locked: 2000 },
  { period: "Apr 2024", unlocked: 4000, locked: 1000 },
  { period: "May 2024", unlocked: 5000, locked: 0 },
];

export default function TokenUnlocks() {
  const last = vestingSchedule.length > 0 ? vestingSchedule[vestingSchedule.length - 1] : { unlocked: 0, locked: 0 };
  const total = last.unlocked + last.locked;

  return (
    <Card className="bg-white/10 dark:bg-black/20 backdrop-blur-lg shadow-2xl border-0 rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-violet-400" />
          <span>Token Unlocks & Vesting</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Total Unlocked</span>
          <span className="text-violet-300 font-semibold text-lg">{(last.unlocked ?? 0).toLocaleString()} / {(total ?? 0).toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-2">
          {vestingSchedule.map((v, i) => {
            const unlocked = v.unlocked ?? 0;
            const locked = v.locked ?? 0;
            const percentUnlocked = (unlocked / (unlocked + locked || 1)) * 100;
            return (
              <div key={v.period} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{v.period}</span>
                  <span>
                    <Unlock className="inline h-3 w-3 text-violet-400 mr-1" />
                    {unlocked.toLocaleString()} &nbsp;
                    <Lock className="inline h-3 w-3 text-gray-400 mr-1" />
                    {locked.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-4 bg-white/10 rounded-lg overflow-hidden flex border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500/70 to-fuchsia-500/70"
                    style={{ width: `${percentUnlocked}%` }}
                  />
                  <div
                    className="h-full bg-white/10"
                    style={{ width: `${100 - percentUnlocked}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Vesting schedule is illustrative. Actual unlocks may vary.
        </div>
      </CardContent>
    </Card>
  );
} 