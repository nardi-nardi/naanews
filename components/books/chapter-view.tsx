import type { BookChapter } from "@/app/types/content";
import { ChatImage } from "../chats/chat-image";

interface ChapterViewProps {
  chapter: BookChapter;
  index: number;
  totalChapters: number;
}

export function ChapterView({
  chapter,
  index,
  totalChapters,
}: ChapterViewProps) {
  return (
    <section
      id={`chapter-${index}`}
      className="glass-panel rounded-3xl p-5 md:p-7"
    >
      <header className="mb-5 border-b border-slate-700/70 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
          Bab {index + 1} dari {totalChapters}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-50 md:text-2xl">
          {chapter.title}
        </h2>
      </header>

      <div className="flex flex-col gap-3">
        {chapter.lines.map((line, lineIndex) => (
          <div
            key={lineIndex}
            className={`flex ${line.role === "q" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-slate-100 md:max-w-[86%] ${
                line.role === "q" ? "chat-bubble-left" : "chat-bubble-right"
              }`}
            >
              <span className="mr-1 text-[11px] font-semibold text-slate-300">
                {line.role === "q" ? "Q:" : "A:"}
              </span>
              {line.text}
              {line.image && <ChatImage src={line.image} />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
