"use client";
import { createContext, useContext, type ReactNode } from "react";
import { createSessionStore } from "@/lib/hooks";
import { track } from "@/lib/analytics";

export type Audience = "player" | "parent";
const Ctx = createContext<{ audience: Audience; setAudience: (a: Audience) => void }>({ audience: "player", setAudience: () => {} });
const store = createSessionStore<Audience>("cs_audience", "player", ["player", "parent"] as const);

export function AudienceProvider({ children }: { children: ReactNode }) {
  const audience = store.use();
  const setAudience = (a: Audience) => { store.set(a); track("audience_select", { audience: a }); };
  return <Ctx.Provider value={{ audience, setAudience }}>{children}</Ctx.Provider>;
}
export const useAudience = () => useContext(Ctx);

export function AudienceSwitch({ className = "" }: { className?: string }) {
  const { audience, setAudience } = useAudience();
  return (
    <div role="radiogroup" aria-label="I am a" className={`inline-flex items-center rounded-full border border-white/20 bg-ink/80 p-1 text-sm backdrop-blur ${className}`}>
      {(["player", "parent"] as const).map((a) => (
        <button key={a} role="radio" aria-checked={audience === a} onClick={() => setAudience(a)}
          className={`rounded-full px-4 py-2 font-semibold transition-colors ${audience === a ? "bg-white text-ink" : "text-white/75 hover:text-white"}`}>
          {a === "player" ? "I’m a player" : "I’m a parent"}
        </button>
      ))}
    </div>
  );
}

/** Renders one of two children depending on the selected audience. */
export function ForAudience({ player, parent }: { player: ReactNode; parent: ReactNode }) {
  const { audience } = useAudience();
  return <>{audience === "parent" ? parent : player}</>;
}
