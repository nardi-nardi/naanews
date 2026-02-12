"use client";

import type { Story } from "@/app/data/content";

type StoryBubbleProps = {
  story: Story;
  active?: boolean;
  onClick?: () => void;
};

export function StoryBubble({ story, active = false, onClick }: StoryBubbleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-[78px] shrink-0 flex-col items-center gap-2 rounded-xl p-1 text-left transition ${
        active ? "bg-cyan-500/10" : "hover:bg-slate-800/45"
      }`}
    >
      <div className={`story-ring ${story.viral ? "story-live" : ""}`}>
        <div className={`story-core grid place-items-center bg-gradient-to-br ${story.palette} text-xs font-semibold text-white`}>
          {story.label}
        </div>
      </div>
      <p className="w-full truncate text-center text-xs text-slate-200">{story.name}</p>
      <span className="rounded-full border border-slate-500/60 px-2 py-0.5 text-[10px] text-slate-300">
        {story.type}
      </span>
    </button>
  );
}
