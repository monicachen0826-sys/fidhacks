"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Upload, Plus, X } from "lucide-react";
import { useLedger } from "@/lib/store";
import { SegmentedControl } from "@/components/SegmentedControl";
import { ImpactSlider } from "@/components/ImpactSlider";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { Category, Significance, Visibility } from "@/lib/types";

const DESCRIPTION_LIMIT = 500;

export default function NewEventPage() {
  const router = useRouter();
  const { addEvent } = useLedger();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [significance, setSignificance] = useState<Significance>(3);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");

  const canSave = title.trim().length > 0 && description.trim().length > 0;

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills([...skills, trimmed]);
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

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
    <div className="px-5 pt-6">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-1 text-sm font-medium text-muted">
        <ChevronLeft size={16} /> Cancel
      </button>

      <h1 className="mb-6 text-xl font-semibold tracking-tight">Add New Event</h1>

      <Field label="Event title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ran First Marathon" />
      </Field>

      <Field label="Category">
        <SegmentedControl<Category>
          options={[
            { value: "professional", label: "Professional", selectedClassName: "bg-blue-500 text-white shadow-sm" },
            { value: "personal", label: "Personal", selectedClassName: "bg-pink-500 text-white shadow-sm" },
            { value: "both", label: "Both", selectedClassName: "bg-purple-500 text-white shadow-sm" },
          ]}
          value={category}
          onChange={setCategory}
        />
      </Field>

      <Field label="Date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>

      <Field label="Description" hint="What happened?">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_LIMIT))}
          placeholder="Tell the story..."
          maxLength={DESCRIPTION_LIMIT}
        />
        <p className="mt-1 text-right text-[11px] text-muted">
          {description.length}/{DESCRIPTION_LIMIT}
        </p>
      </Field>

      <Field label="Impact Level">
        <ImpactSlider value={significance} onChange={setSignificance} />
      </Field>

      <Field label="Skills / tags" hint="Add one at a time">
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="e.g. Leadership"
          />
          <button
            type="button"
            onClick={addSkill}
            aria-label="Add skill"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-accent text-white"
          >
            <Plus size={18} />
          </button>
        </div>
        {skills.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <Badge key={s} className="flex items-center gap-1 pr-1.5">
                {s}
                <button type="button" onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                  <X size={11} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </Field>

      <Field label="Evidence" hint="Optional — attach a link, photo, or document">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-muted"
        >
          <Upload size={15} /> Upload evidence
        </button>
      </Field>

      <div className="card-surface mb-6 flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium">Show in Portfolio</p>
          <p className="text-xs text-muted">Visible on your shareable portfolio</p>
        </div>
        <Switch
          checked={visibility === "portfolio"}
          onCheckedChange={(checked) => setVisibility(checked ? "portfolio" : "private")}
        />
      </div>

      <Button className="w-full" disabled={!canSave} onClick={handleSave}>
        Save Event
      </Button>
    </div>
  );
}
