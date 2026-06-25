"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import { useLedger } from "@/lib/store";
import { ImpactSlider } from "@/components/ImpactSlider";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Significance } from "@/lib/types";

const DESCRIPTION_LIMIT = 500;

export default function NewSubEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getEvent, addSubEvent } = useLedger();
  const event = getEvent(id);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [whyItMattered, setWhyItMattered] = useState("");
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [significance, setSignificance] = useState<Significance>(2);

  if (!event) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 pt-20 text-center">
        <p className="text-sm text-muted">This event couldn&apos;t be found.</p>
      </div>
    );
  }

  const canSave = title.trim().length > 0 && description.trim().length > 0;
  const eventId = event.id;

  function addSkillTag() {
    const trimmed = skillInput.trim();
    if (!trimmed || skillTags.includes(trimmed)) return;
    setSkillTags([...skillTags, trimmed]);
    setSkillInput("");
  }

  function removeSkillTag(skill: string) {
    setSkillTags(skillTags.filter((s) => s !== skill));
  }

  function handleSave() {
    if (!canSave) return;
    const sub = addSubEvent(eventId, {
      title: title.trim(),
      date,
      description: description.trim(),
      whyItMattered: whyItMattered.trim() || undefined,
      significance,
      skillTags,
    });
    router.push(`/event/${eventId}/sub/${sub.id}`);
  }

  return (
    <div className="px-5 pt-6">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-1 text-sm font-medium text-muted">
        <ChevronLeft size={16} /> Cancel
      </button>

      <h1 className="mb-1 text-xl font-semibold tracking-tight">Add Micro-win</h1>
      <p className="mb-6 text-sm text-muted">Inside &ldquo;{event.title}&rdquo;</p>

      <Field label="Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Shipped first PR" />
      </Field>

      <Field label="Date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>

      <Field label="What happened?">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_LIMIT))}
          placeholder="Describe the moment..."
          maxLength={DESCRIPTION_LIMIT}
        />
        <p className="mt-1 text-right text-[11px] text-muted">
          {description.length}/{DESCRIPTION_LIMIT}
        </p>
      </Field>

      <Field label="Why did it matter?" hint="What skill or growth did this show?">
        <Textarea value={whyItMattered} onChange={(e) => setWhyItMattered(e.target.value)} placeholder="What clicked for you?" />
      </Field>

      <Field label="Skill demonstrated" hint="Add one at a time">
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkillTag();
              }
            }}
            placeholder="e.g. Resilience"
          />
          <button
            type="button"
            onClick={addSkillTag}
            aria-label="Add skill"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-accent text-white"
          >
            <Plus size={18} />
          </button>
        </div>
        {skillTags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {skillTags.map((s) => (
              <Badge key={s} className="flex items-center gap-1 pr-1.5">
                {s}
                <button type="button" onClick={() => removeSkillTag(s)} aria-label={`Remove ${s}`}>
                  <X size={11} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </Field>

      <Field label="Significance level">
        <ImpactSlider value={significance} onChange={setSignificance} />
      </Field>

      <Button className="w-full" disabled={!canSave} onClick={handleSave}>
        Save Sub-event
      </Button>
    </div>
  );
}
