import Image from "next/image";
import { ChatImage } from "@/components/chats/chat-image";
import { RelativeTime } from "@/components/relative-time";
import type { Feed } from "@/types/content";

type ReadArticleBodyProps = {
  feed: Feed;
};

export function ReadArticleBody({ feed }: ReadArticleBodyProps) {
  return (
    <article className="glass-panel overflow-hidden rounded-3xl">
      <div className="relative h-56 w-full md:h-72">
        <Image
          src={feed.image}
          alt={feed.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 900px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent" />
      </div>

      <div className="p-5 md:p-7">
        <header className="mb-5 border-b border-slate-700/70 pb-5">
          <h1 className="text-2xl font-bold text-slate-50 md:text-3xl">
            {feed.title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            <RelativeTime timestamp={feed.createdAt} />
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {feed.lines.map((line, lineIndex) => (
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
                {line.image ? <ChatImage src={line.image} /> : null}
              </div>
            </div>
          ))}
        </div>

        {feed.source ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3">
            <svg
              className="h-4 w-4 shrink-0 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="text-xs text-slate-400">Sumber:</span>
            <a
              href={feed.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-300 underline decoration-cyan-300/30 underline-offset-2 transition hover:text-cyan-200 hover:decoration-cyan-200/50"
            >
              {feed.source.title}
            </a>
          </div>
        ) : null}

        <div className="mt-5 rounded-xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <strong>Inti cepat:</strong> {feed.takeaway}
        </div>
      </div>
    </article>
  );
}
