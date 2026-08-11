"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
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
                isOpen ? "max-h-96 pb-5" : "max-h-0",
              ].join(" ")}
            >
              <p className="px-6 text-sm leading-relaxed text-slate-600">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
