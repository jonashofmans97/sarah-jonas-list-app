import { ChevronRight, Plus, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ListForm } from '../components/ListForm'
import { useLists } from '../lib/data'
import { getDefaultList, getMe, setDefaultList } from '../lib/device'
import { ListIcon } from '../lib/icons'
import type { List } from '../lib/types'

export default function Overview() {
  const { lists, loading, error, save, remove } = useLists()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<List | null>(null)
  const [, force] = useState(0)
  const defId = getDefaultList()

  const handleSave = async (
    v: { id?: string; name: string; description: string | null; color: string; icon: string },
    def: boolean,
  ) => {
    await save(v)
    if (v.id) {
      if (def) setDefaultList(v.id)
      else if (getDefaultList() === v.id) setDefaultList(null)
    }
    setCreating(false)
    setEditing(null)
    force((n) => n + 1)
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 pb-32">
      <header className="pt-safe pb-5 pt-6">
        <p className="text-sm text-muted">Hi {getMe()} 👋</p>
        <h1 className="text-3xl font-bold tracking-tight">Our lists</h1>
      </header>

      {error && <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}

      {!loading && lists.length === 0 && !error && (
        <div className="mt-20 text-center text-muted">
          <p className="text-lg">No lists yet</p>
          <p className="text-sm">Tap + to create your first one</p>
        </div>
      )}

      <div className="space-y-3">
        {lists.map((l) => (
          <div
            key={l.id}
            className="relative flex items-center overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <span className="absolute inset-y-0 left-0 w-1" style={{ background: l.color }} />
            <Link to={`/list/${l.id}`} className="flex min-w-0 flex-1 items-center gap-4 p-4 pl-5 active:bg-surface-2">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: l.color + '26', color: l.color }}>
                <ListIcon name={l.icon} size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 truncate font-semibold">
                  {l.name}
                  {defId === l.id && <Star size={13} className="shrink-0" fill={l.color} stroke={l.color} />}
                </span>
                {l.description && <span className="block truncate text-sm text-muted">{l.description}</span>}
              </span>
              <ChevronRight size={18} className="text-muted" />
            </Link>
            <button onClick={() => setEditing(l)} className="self-stretch border-l border-line px-4 text-xs text-muted active:bg-surface-2">
              Edit
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCreating(true)}
        className="fixed right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-xl active:scale-95"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)', boxShadow: '0 8px 24px #3b82f666' }}
        aria-label="New list"
      >
        <Plus size={26} />
      </button>

      {creating && <ListForm isDefault={false} onClose={() => setCreating(false)} onSave={handleSave} />}
      {editing && (
        <ListForm
          list={editing}
          isDefault={defId === editing.id}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onDelete={async () => {
            if (defId === editing.id) setDefaultList(null)
            await remove(editing.id)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}
