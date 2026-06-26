"use client"

import * as React from "react"
import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
} from "kbar"

export function CommandPalette() {
  return (
    <KBarPortal>
      <KBarPositioner className="bg-black/60 backdrop-blur-sm z-50">
        <KBarAnimator className="w-full max-w-[600px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
          <KBarSearch 
            className="w-full border-b border-zinc-800 bg-transparent px-4 py-4 text-sm text-white placeholder-zinc-500 outline-none" 
            placeholder="Ketik perintah atau cari..." 
          />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}

function RenderResults() {
  const { results } = useMatches()

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-950">
            {item}
          </div>
        ) : (
          <div
            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
              active
                ? "bg-zinc-800/80 text-white font-medium"
                : "bg-zinc-950 text-zinc-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">{item.name}</span>
            </div>
            {item.shortcut?.length ? (
              <div className="flex gap-1">
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  )
}
