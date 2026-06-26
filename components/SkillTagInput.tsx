"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SkillTagInput({
  tags,
  onChange,
  placeholder = "Add skill",
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  function addTag() {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
    setAdding(false);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent"
        >
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} aria-label={`Remove ${tag}`}>
            <X size={14} />
          </button>
        </span>
      ))}
      {adding ? (
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={addTag}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTag();
            if (e.key === "Escape") setAdding(false);
          }}
          placeholder={placeholder}
          className="min-w-[100px] rounded-full border border-border px-3 py-1.5 text-[13px] outline-none focus:border-accent"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-border text-muted transition-colors hover:border-accent hover:text-accent"
          )}
          aria-label="Add tag"
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}
