"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Upload } from "lucide-react";
import { useLedger } from "@/lib/store";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SignificanceDots } from "@/components/SignificanceDots";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Category, Significance, Visibility } from "@/lib/types";

export default function NewEventPage() {
  const router = useRouter();
  const { addEvent } = useLedger();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [significance, setSignificance] = useState<Significance>(3);
  const [skillsInput, setSkillsInput] = useState("");
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
      skills: skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
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
            { value: "professional", label: "Professional" },
            { value: "personal", label: "Personal" },
            { value: "both", label: "Both" },
          ]}
          value={category}
          onChange={setCategory}
        />
      </Field>

      <Field label="Date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>

      <Field label="Description" hint="What happened?">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell the story..." />
      </Field>

      <Field label="Significance level">
        <SignificanceDots value={significance} onChange={setSignificance} />
      </Field>

      <Field label="Skills / tags" hint="Comma separated, e.g. Leadership, Communication">
        <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Leadership, Communication" />
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
