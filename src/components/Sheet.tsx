import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="sheet-in pb-safe max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-surface px-5 pt-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full bg-surface-2 p-2 text-muted" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const inputCls =
  'w-full rounded-xl border border-line bg-surface-2 px-3.5 py-3 outline-none placeholder:text-muted/70 focus:border-accent'
export const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted'
