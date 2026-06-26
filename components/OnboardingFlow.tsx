"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/lib/onboarding-store";
import { CHECKLIST_ITEMS, GOAL_SLIDERS } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

type Step = "intro" | "checklist" | "goals";

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>("intro");
  const { checklist, goals, toggleChecklistItem, setGoalValue, complete } = useOnboarding();

  return (
    <div className="flex h-full flex-col px-6 pt-10">
      <div className="mb-6 flex justify-center gap-1.5">
        {(["intro", "checklist", "goals"] as Step[]).map((s) => (
          <span key={s} className={cn("h-1.5 w-8 rounded-full", step === s ? "gradient-accent" : "bg-black/10")} />
        ))}
      </div>

      {step === "intro" && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full gradient-accent text-white">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to Probble</h1>
          <p className="mt-2 text-sm text-muted">
            A quick survey to help us understand what counts as a win for you. It takes less than a minute.
          </p>
          <Button className="mt-8 w-full" onClick={() => setStep("checklist")}>
            Get started
          </Button>
        </div>
      )}

      {step === "checklist" && (
        <div className="flex flex-1 flex-col">
          <h1 className="text-xl font-semibold tracking-tight">Let&apos;s start with easy ones</h1>
          <p className="mt-1 text-sm text-muted">Tap anything that&apos;s happened to you — recently or ever.</p>

          <div className="mt-5 flex-1 space-y-2.5 overflow-y-auto pb-4">
            {CHECKLIST_ITEMS.map((item) => {
              const checked = !!checklist[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={cn(
                    "card-surface flex w-full items-start gap-3 p-3.5 text-left transition-all active:scale-[0.99]",
                    checked && "ring-2 ring-[#8a5cf6]/40"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      checked ? "gradient-accent border-transparent text-white" : "border-black/15"
                    )}
                  >
                    {checked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="text-[13px] leading-snug">{item.label}</span>
                </button>
              );
            })}
          </div>

          <Button className="w-full" onClick={() => setStep("goals")}>
            Continue
          </Button>
        </div>
      )}

      {step === "goals" && (
        <div className="flex flex-1 flex-col">
          <h1 className="text-xl font-semibold tracking-tight">What are you hoping for?</h1>
          <p className="mt-2 text-xs text-muted">
            Don&apos;t worry — this won&apos;t determine your app experience. It just helps us tailor a few defaults.
          </p>

          <div className="mt-5 flex-1 space-y-5 overflow-y-auto pb-4">
            {GOAL_SLIDERS.map((g) => {
              const value = goals[g.id] ?? 50;
              return (
                <div key={g.id} className="card-surface p-4">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={(e) => setGoalValue(g.id, Number(e.target.value))}
                    className="w-full accent-[#8a5cf6]"
                  />
                  <div className="mt-2 flex items-start justify-between gap-2 text-[11px] text-muted">
                    <span className="flex-1 leading-tight">{g.left}</span>
                    <span className="flex-1 text-right leading-tight">{g.right}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <Button className="w-full" onClick={complete}>
            Finish setup
          </Button>
        </div>
      )}
    </div>
  );
}
