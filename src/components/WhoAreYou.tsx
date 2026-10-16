import { useState } from 'react'
import { setMe } from '../lib/device'
import type { Person } from '../lib/types'

export function WhoAreYou({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false)
  const pick = (p: Person) => {
    if (busy) return
    setBusy(true)
    setMe(p)
    onDone()
  }
  return (
    <div className="pt-safe pb-safe flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-2 text-3xl font-bold">Welcome 👋</h1>
      <p className="mb-10 text-muted">Who's holding this phone?</p>
      <div className="grid w-full max-w-sm grid-cols-2 gap-4">
        {(['Kokki', 'Peppi'] as Person[]).map((p) => (
          <button
            key={p}
            onClick={() => pick(p)}
            className="rounded-3xl border border-line bg-surface py-10 text-xl font-semibold transition active:scale-95 active:border-accent"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
