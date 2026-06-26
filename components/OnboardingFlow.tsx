"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useOnboarding } from "@/lib/onboarding-store";
import { useProfile } from "@/lib/profile-store";
import { CHECKLIST_ITEMS, GOAL_SLIDERS } from "@/lib/onboarding";
import { applyGoalsToPreferences } from "@/lib/personalization";
import { cn } from "@/lib/utils";

type Step = "intro" | "checklist" | "goals";

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>("intro");
  const { checklist, goals, toggleChecklistItem, setGoalValue, complete } = useOnboarding();
  const { updateProfile, updatePreferences } = useProfile();

  function finishSetup() {
    updatePreferences(applyGoalsToPreferences(goals));
    const selectedCount = Object.values(checklist).filter(Boolean).length;
    updateProfile({
      bio:
        selectedCount > 0
          ? `Tracking ${selectedCount} kinds of wins — from easy moments to big milestones.`
          : "Building my multiverse one win at a time.",
    });
    complete();
  }

  return (
    <div className="flex h-full min-h-[700px] flex-col px-5 pt-6">
      <div className="mb-5 flex justify-center gap-1.5">
        {(["intro", "checklist", "goals"] as Step[]).map((s) => (
          <span key={s} className={cn("h-1.5 w-8 rounded-full", step === s ? "gradient-accent" : "bg-white/10")} />
        ))}
      </div>

      {step === "intro" && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full gradient-accent text-white">
            <Sparkles size={24} />
          </div>
          <h1 className="serif-heading text-2xl text-foreground">Welcome to My Multiverse</h1>
          <p className="mt-2 text-sm text-muted">
            A quick survey to understand what counts as a win for you. Takes less than a minute.
          </p>
          <button type="button" onClick={() => setStep("checklist")} className="mt-8 w-full rounded-full gradient-accent py-3.5 text-sm font-bold text-white">
            Get started
          </button>
        </div>
      )}

      {step === "checklist" && (
        <div className="flex flex-1 flex-col">
          <h1 className="serif-heading text-xl text-foreground">Let&apos;s start with easy ones</h1>
          <p className="mt-1 text-sm text-muted">Tap anything that&apos;s happened to you — recently or ever.</p>

          <div className="mt-4 flex-1 space-y-2 overflow-y-auto pb-4">
            {CHECKLIST_ITEMS.map((item) => {
              const checked = !!checklist[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className={cn(
                    "card-surface flex w-full items-start gap-3 p-3.5 text-left transition-all active:scale-[0.99]",
                    checked && "ring-2 ring-accent/40"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      checked ? "gradient-accent border-transparent text-white" : "border-white/20"
                    )}
                  >
                    {checked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="text-[13px] leading-snug text-foreground/90">{item.label}</span>
                </button>
              );
            })}
          </div>

          <button type="button" onClick={() => setStep("goals")} className="w-full rounded-full gradient-accent py-3.5 text-sm font-bold text-white">
            Continue
          </button>
        </div>
      )}

      {step === "goals" && (
        <div className="flex flex-1 flex-col">
          <h1 className="serif-heading text-xl text-foreground">What are you hoping for?</h1>
          <p className="mt-2 text-xs text-muted/80">
            Don&apos;t worry — this won&apos;t lock you in or change your experience permanently. It just helps us tailor a few defaults.
          </p>

          <div className="mt-4 flex-1 space-y-4 overflow-y-auto pb-4">
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
                    className="w-full accent-[#7c3aed]"
                  />
                  <div className="mt-2 flex items-start justify-between gap-2 text-[11px] text-muted">
                    <span className="flex-1 leading-tight">{g.left}</span>
                    <span className="flex-1 text-right leading-tight">{g.right}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={finishSetup} className="w-full rounded-full gradient-accent py-3.5 text-sm font-bold text-white">
            Finish setup
          </button>
        </div>
      )}
    </div>
  );
}
