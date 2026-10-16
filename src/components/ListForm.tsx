import { useState } from 'react'
import { COLORS, ICONS, ListIcon } from '../lib/icons'
import type { List } from '../lib/types'
import { Sheet, inputCls, labelCls } from './Sheet'

interface Props {
  list?: List
  isDefault: boolean
  onSave: (v: { id?: string; name: string; description: string | null; color: string; icon: string }, makeDefault: boolean) => void
  onDelete?: () => void
  onClose: () => void
}

export function ListForm({ list, isDefault, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(list?.name ?? '')
  const [description, setDescription] = useState(list?.description ?? '')
  const [color, setColor] = useState(list?.color ?? COLORS[0])
  const [icon, setIcon] = useState(list?.icon ?? 'shopping-cart')
  const [def, setDef] = useState(isDefault)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ id: list?.id, name: name.trim(), description: description.trim() || null, color, icon }, def)
  }

  return (
    <Sheet title={list ? 'Edit list' : 'New list'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={labelCls}>Name</label>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Colruyt" autoFocus={!list} />
        </div>
        <div>
          <label className={labelCls}>Description (optional)</label>
          <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Weekly groceries" />
        </div>
        <div>
          <label className={labelCls}>Color</label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                aria-label={c}
                className="h-9 w-9 rounded-full transition-transform"
                style={{ background: c, boxShadow: color === c ? `0 0 0 3px #121a30, 0 0 0 5px ${c}` : undefined, transform: color === c ? 'scale(1.05)' : undefined }}
              />
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Icon</label>
          <div className="grid grid-cols-6 gap-2">
            {Object.keys(ICONS).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setIcon(k)}
                className="flex aspect-square items-center justify-center rounded-xl border bg-surface-2"
                style={{ borderColor: icon === k ? color : 'transparent', color: icon === k ? color : '#8b97b8' }}
              >
                <ListIcon name={k} />
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3">
          <span className="text-sm">Open this list on startup (this phone)</span>
          <input type="checkbox" checked={def} onChange={(e) => setDef(e.target.checked)} className="h-5 w-5 accent-blue-500" />
        </label>
        <button type="submit" className="w-full rounded-xl py-3.5 font-semibold text-white" style={{ background: color }}>
          {list ? 'Save' : 'Create list'}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={() => confirm(`Delete "${list?.name}" and all its items?`) && onDelete()}
            className="w-full rounded-xl border border-red-500/40 py-3 text-red-400"
          >
            Delete list
          </button>
        )}
      </form>
    </Sheet>
  )
}
