"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TestEvent } from "@/services/testService";
import { Terminal } from "lucide-react";

export default function LiveEventConsole({ events }: { events: TestEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const prevEventCount = useRef(events.length);

  useEffect(() => {
    if (events.length > prevEventCount.current && containerRef.current) {
      const children = Array.from(containerRef.current.children).filter(
        (el) => el !== endOfMessagesRef.current
      );
      const newItemsCount = events.length - prevEventCount.current;
      const newItems = children.slice(-newItemsCount);

      if (newItems.length > 0) {
        gsap.fromTo(
          newItems,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
        );
      }

      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevEventCount.current = events.length;
  }, [events]);

  return (
    <div className="flex flex-col h-full min-h-[300px] border border-white/10 bg-[#0A0A0A] rounded-xl overflow-hidden shadow-2xl relative">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/[0.02]">
        <Terminal className="w-4 h-4 text-slate-400" />
        <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
          Live Telemetry
        </span>
      </div>

      <div 
        className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
      >
        <div ref={containerRef}>
          {events.length === 0 ? (
            <p className="text-slate-600 italic">Waiting for machine execution...</p>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="flex gap-3 leading-relaxed">
                <span className="text-slate-500 shrink-0">[{ev.timestamp}]</span>
                <span
                  className={`${
                    ev.type === "error"
                      ? "text-red-400"
                      : ev.type === "success"
                      ? "text-lime"
                      : ev.type === "warning"
                      ? "text-amber-400"
                      : "text-slate-300"
                  }`}
                >
                  {ev.message}
                </span>
              </div>
            ))
          )}
          <div ref={endOfMessagesRef} className="h-1" />
        </div>
      </div>
    </div>
  );
}
