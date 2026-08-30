"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqAnswerBlock =
  | { type: "text"; content: string }
  | { type: "list"; items: string[] };

interface FaqItem {
  id: string;
  question: string;
  answerBlocks: FaqAnswerBlock[];
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
      {items.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id}>
            <button
              type="button"
              onClick={() => toggle(faq.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-slate-50"
            >
              <span className="text-base font-semibold text-slate-900">
                {faq.question}
              </span>
              <ChevronDown
                className={[
                  "h-5 w-5 flex-none text-slate-400 transition-transform duration-200",
                  isOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
            <div
              className={[
                "overflow-hidden transition-all duration-200",
                isOpen ? "max-h-[2000px] pb-5" : "max-h-0",
              ].join(" ")}
            >
              <div className="space-y-3 px-6">
                {faq.answerBlocks.map((block, i) => {
                  if (block.type === "list") {
                    return (
                      <ul key={i} className="space-y-1.5 pt-1">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-indigo-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={i} className="text-sm leading-relaxed text-slate-600">
                      {block.content}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
