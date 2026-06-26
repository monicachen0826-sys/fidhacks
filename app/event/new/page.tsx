"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Upload } from "lucide-react";
import { useLedger } from "@/lib/store";
import { FormHeader } from "@/components/AppHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SignificanceDots } from "@/components/SignificanceDots";
import { SkillTagInput } from "@/components/SkillTagInput";
import { Switch } from "@/components/ui/switch";
import type { Category, Significance, Visibility } from "@/lib/types";

const MAX_DESC = 500;

export default function NewEventPage() {
  const router = useRouter();
  const { addEvent } = useLedger();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [significance, setSignificance] = useState<Significance>(3);
  const [skills, setSkills] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("private");

  const canSave = title.trim().length > 0 && description.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const event = addEvent({
      title: title.trim(),
      category,
      date,
      description: description.trim(),
      significance,
      visibility,
      skills,
    });
    router.push(`/event/${event.id}`);
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <FormHeader
        title="Add New Event"
        onClose={() => router.back()}
        onSave={handleSave}
        canSave={canSave}
      />

      <div className="space-y-5 px-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">Event Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Ran First Marathon"
            className="w-full rounded-2xl glass-dark px-4 py-3 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">Category</label>
          <SegmentedControl<Category>
            options={[
              { value: "professional", label: "Professional" },
              { value: "personal", label: "Personal" },
              { value: "both", label: "Both" },
            ]}
            value={category}
            onChange={setCategory}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">Date</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl glass-dark py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold text-muted">What happened?</label>
            <span className="text-[11px] text-muted">
              {description.length}/{MAX_DESC}
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
            placeholder="Tell the story..."
            rows={4}
            className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">Category / Skills</label>
          <SkillTagInput tags={skills} onChange={setSkills} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-muted">Impact Level</label>
          <div className="flex items-center justify-between rounded-2xl glass-dark px-4 py-3">
            <span className="text-xs text-muted">1</span>
            <SignificanceDots value={significance} onChange={setSignificance} />
            <span className="text-xs text-muted">5</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">Evidence</label>
          <button
            type="button"
            className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/10 glass-dark text-sm text-muted"
          >
            <Upload size={20} />
            Upload photo or document
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl glass-dark p-4">
          <div>
            <p className="text-sm font-bold">Show in Portfolio</p>
            <p className="text-xs text-muted">Visible on your shareable portfolio</p>
          </div>
          <Switch
            checked={visibility === "portfolio"}
            onCheckedChange={(checked) => setVisibility(checked ? "portfolio" : "private")}
          />
        </div>
      </div>
    </div>
  );
}
