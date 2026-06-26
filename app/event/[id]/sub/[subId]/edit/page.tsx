"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useLedger } from "@/lib/store";
import { SignificanceDots } from "@/components/SignificanceDots";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Significance } from "@/lib/types";

export default function EditSubEventPage() {
  const { id, subId } = useParams<{ id: string; subId: string }>();
  const router = useRouter();
  const { getEvent, getSubEvent, updateSubEvent } = useLedger();
  const event = getEvent(id);
  const sub = getSubEvent(id, subId);

  const [title, setTitle] = useState(sub?.title ?? "");
  const [date, setDate] = useState(sub?.date ?? new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState(sub?.description ?? "");
  const [whyItMattered, setWhyItMattered] = useState(sub?.whyItMattered ?? "");
  const [skillTagsInput, setSkillTagsInput] = useState(sub?.skillTags.join(", ") ?? "");
  const [significance, setSignificance] = useState<Significance>(sub?.significance ?? 2);

  if (!event || !sub) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 pt-20 text-center">
        <p className="text-sm text-muted">This microwin couldn&apos;t be found.</p>
      </div>
    );
  }

  const canSave = title.trim().length > 0 && description.trim().length > 0;
  const eventId = event.id;

  function handleSave() {
    if (!canSave) return;
    updateSubEvent(eventId, subId, {
      title: title.trim(),
      date,
      description: description.trim(),
      whyItMattered: whyItMattered.trim() || undefined,
      significance,
      skillTags: skillTagsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    router.push(`/event/${eventId}/sub/${subId}`);
  }

  return (
    <div className="px-5 pt-6">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-1 text-sm font-medium text-muted">
        <ChevronLeft size={16} /> Cancel
      </button>

      <h1 className="mb-1 text-xl font-semibold tracking-tight">Edit Micro-win</h1>
      <p className="mb-6 text-sm text-muted">Inside &ldquo;{event.title}&rdquo;</p>

      <Field label="Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Shipped first PR" />
      </Field>

      <Field label="Date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>

      <Field label="What happened?">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the moment..." />
      </Field>

      <Field label="Why did it matter?" hint="What skill or growth did this show?">
        <Textarea value={whyItMattered} onChange={(e) => setWhyItMattered(e.target.value)} placeholder="What clicked for you?" />
      </Field>

      <Field label="Skill demonstrated" hint="Comma separated, e.g. Resilience, Technical Skill">
        <Input value={skillTagsInput} onChange={(e) => setSkillTagsInput(e.target.value)} placeholder="Resilience, Communication" />
      </Field>

      <Field label="Significance level">
        <SignificanceDots value={significance} onChange={setSignificance} />
      </Field>

      <Button className="w-full" disabled={!canSave} onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
}
