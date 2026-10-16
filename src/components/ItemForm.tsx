import { Minus, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchSuggestions } from '../lib/data'
import type { Item } from '../lib/types'
import { Sheet, inputCls, labelCls } from './Sheet'

interface Props {
  item?: Item
  color: string
  categories: string[]
  onSave: (v: { title: string; description: string | null; amount: number; category: string | null }) => void
  onDelete?: () => void
  onClose: () => void
}

export function ItemForm({ item, color, categories, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(item?.title ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [amount, setAmount] = useState(item?.amount ?? 1)
  const [category, setCategory] = useState(item?.category ?? '')
  const [suggestions, setSuggestions] = useState<{ title: string; category: string | null }[]>([])

  useEffect(() => {
    if (!item) fetchSuggestions().then(setSuggestions)
  }, [item])

  const matches = useMemo(() => {
    const q = title.trim().toLowerCase()
    if (item || !q) return []
    return suggestions.filter((s) => s.title.toLowerCase().includes(q) && s.title.toLowerCase() !== q).slice(0, 5)
  }, [title, suggestions, item])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), description: description.trim() || null, amount: Math.max(1, amount), category: category.trim() || null })
  }

  return (
    <Sheet title={item ? 'Edit item' : 'Add item'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={labelCls}>Title</label>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Milk" autoFocus />
          {matches.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {matches.map((m) => (
                <button
                  type="button"
                  key={m.title}
                  onClick={() => {
                    setTitle(m.title)
                    if (m.category && !category) setCategory(m.category)
                  }}
                  className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm"
                  style={{ color }}
                >
                  {m.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className={labelCls}>Amount</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setAmount((a) => Math.max(1, a - 1))} className="rounded-xl bg-surface-2 p-3.5">
              <Minus size={18} />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              className={inputCls + ' text-center'}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
            />
            <button type="button" onClick={() => setAmount((a) => a + 1)} className="rounded-xl bg-surface-2 p-3.5">
              <Plus size={18} />
            </button>
          </div>
        </div>
        <div>
          <label className={labelCls}>Description (optional)</label>
          <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Semi-skimmed" />
        </div>
        <div>
          <label className={labelCls}>Category (optional)</label>
          <input className={inputCls} list="cats" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Dairy" />
          <datalist id="cats">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <button type="submit" className="w-full rounded-xl py-3.5 font-semibold text-white" style={{ background: color }}>
          {item ? 'Save' : 'Add item'}
        </button>
        {onDelete && (
          <button type="button" onClick={onDelete} className="w-full rounded-xl border border-red-500/40 py-3 text-red-400">
            Delete item
          </button>
        )}
      </form>
    </Sheet>
  )
}
