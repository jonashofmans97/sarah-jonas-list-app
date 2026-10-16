import { Check, ChevronLeft, GripVertical, Minus, Plus, Trash2 } from 'lucide-react'
import { DndContext, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ItemForm } from '../components/ItemForm'
import { ListForm } from '../components/ListForm'
import { useItems, useLists } from '../lib/data'
import { getDefaultList, setDefaultList } from '../lib/device'
import { ListIcon } from '../lib/icons'
import type { Item } from '../lib/types'

function Row({ item, color, onEdit, onToggle, onAmount, draggable }: {
  item: Item
  color: string
  onEdit: () => void
  onToggle: () => void
  onAmount: (d: number) => void
  draggable: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: !draggable })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined }}
      className={`flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 ${isDragging ? 'shadow-xl' : ''} ${item.checked ? 'opacity-50' : ''}`}
    >
      <button
        onClick={onToggle}
        aria-label="Toggle done"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2"
        style={{ borderColor: color, background: item.checked ? color : 'transparent' }}
      >
        {item.checked && <Check size={16} className="text-white" strokeWidth={3} />}
      </button>
      <button onClick={onEdit} className="min-w-0 flex-1 text-left">
        <div className={`truncate font-medium ${item.checked ? 'line-through' : ''}`}>{item.title}</div>
        {item.description && <div className="truncate text-sm text-muted">{item.description}</div>}
      </button>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onAmount(-1)} className="rounded-lg bg-surface-2 p-1.5 text-muted" aria-label="Less">
          <Minus size={14} />
        </button>
        <span className="min-w-6 text-center text-sm font-semibold tabular-nums" style={{ color }}>
          {item.amount}
        </span>
        <button onClick={() => onAmount(1)} className="rounded-lg bg-surface-2 p-1.5 text-muted" aria-label="More">
          <Plus size={14} />
        </button>
      </div>
      {draggable && (
        <button {...attributes} {...listeners} style={{ touchAction: 'none' }} className="p-1 text-muted" aria-label="Drag">
          <GripVertical size={18} />
        </button>
      )}
    </div>
  )
}

export default function ListDetail() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const { lists, loading: listsLoading, save, remove: removeList } = useLists()
  const { items, loading, add, update, remove, clearChecked } = useItems(id)
  const [editing, setEditing] = useState<Item | null>(null)
  const [adding, setAdding] = useState(false)
  const [editList, setEditList] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
  )

  const list = lists.find((l) => l.id === id)
  const color = list?.color ?? '#3b82f6'

  const categories = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean) as string[])].sort(), [items])
  const open = items.filter((i) => !i.checked)
  const done = items.filter((i) => i.checked)

  const groups = useMemo(() => {
    const m = new Map<string, Item[]>()
    for (const i of open) {
      const k = i.category ?? ''
      m.set(k, [...(m.get(k) ?? []), i])
    }
    // uncategorised first, then alphabetical
    return [...m.entries()].sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)))
  }, [open])

  const onDragEnd = (group: Item[]) => (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const from = group.findIndex((i) => i.id === active.id)
    const to = group.findIndex((i) => i.id === over.id)
    const next = [...group]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    const prev = next[to - 1]?.position
    const after = next[to + 1]?.position
    const pos = prev !== undefined && after !== undefined ? (prev + after) / 2 : prev !== undefined ? prev + 1 : after !== undefined ? after - 1 : moved.position
    update(moved.id, { position: pos })
  }

  if (!listsLoading && !list) {
    return (
      <div className="pt-safe p-6 text-center">
        <p className="mt-20 text-muted">This list doesn't exist (anymore).</p>
        <Link to="/" className="mt-4 inline-block text-accent">Back to overview</Link>
      </div>
    )
  }

  const renderRow = (i: Item, draggable: boolean) => (
    <Row
      key={i.id}
      item={i}
      color={color}
      draggable={draggable}
      onEdit={() => setEditing(i)}
      onToggle={() => update(i.id, { checked: !i.checked })}
      onAmount={(d) => update(i.id, { amount: Math.max(1, i.amount + d) })}
    />
  )

  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-32">
      <header className="pt-safe sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/" className="rounded-full bg-surface-2 p-2" aria-label="Back to overview">
            <ChevronLeft size={20} />
          </Link>
          <button onClick={() => setEditList(true)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: color + '26', color }}>
              <ListIcon name={list?.icon ?? 'list'} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-semibold leading-tight">{list?.name ?? '…'}</span>
              {list?.description && <span className="block truncate text-xs text-muted">{list.description}</span>}
            </span>
          </button>
        </div>
        <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </header>

      <main className="space-y-5 px-4 pt-4">
        {!loading && items.length === 0 && (
          <div className="mt-16 text-center text-muted">
            <p className="text-lg">Nothing here yet</p>
            <p className="text-sm">Tap + to add your first item</p>
          </div>
        )}

        {groups.map(([cat, group]) => (
          <section key={cat || '_'}>
            {(cat || groups.length > 1) && (
              <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider" style={{ color }}>
                {cat || 'Other'}
              </h3>
            )}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd(group)}>
              <SortableContext items={group.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">{group.map((i) => renderRow(i, true))}</div>
              </SortableContext>
            </DndContext>
          </section>
        ))}

        {done.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Done ({done.length})</h3>
              <button onClick={() => confirm('Remove all checked items?') && clearChecked()} className="flex items-center gap-1 text-xs text-red-400">
                <Trash2 size={13} /> Clear
              </button>
            </div>
            <div className="space-y-2">{done.map((i) => renderRow(i, false))}</div>
          </section>
        )}
      </main>

      <button
        onClick={() => setAdding(true)}
        className="fixed right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl active:scale-95"
        style={{ background: color, bottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)', boxShadow: `0 8px 24px ${color}66` }}
        aria-label="Add item"
      >
        <Plus size={26} />
      </button>

      {adding && (
        <ItemForm
          color={color}
          categories={categories}
          onClose={() => setAdding(false)}
          onSave={async (v) => {
            setAdding(false)
            await add(v)
          }}
        />
      )}
      {editing && (
        <ItemForm
          item={editing}
          color={color}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={(v) => {
            update(editing.id, v)
            setEditing(null)
          }}
          onDelete={() => {
            remove(editing.id)
            setEditing(null)
          }}
        />
      )}
      {editList && list && (
        <ListForm
          list={list}
          isDefault={getDefaultList() === list.id}
          onClose={() => setEditList(false)}
          onSave={async (v, def) => {
            await save(v)
            if (def) setDefaultList(list.id)
            else if (getDefaultList() === list.id) setDefaultList(null)
            setEditList(false)
          }}
          onDelete={async () => {
            if (getDefaultList() === list.id) setDefaultList(null)
            await removeList(list.id)
            nav('/', { replace: true })
          }}
        />
      )}
    </div>
  )
}
