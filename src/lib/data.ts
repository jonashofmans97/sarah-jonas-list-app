import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Item, List } from './types'

/** Subscribes to realtime changes of a table; falls back silently if realtime is unavailable. */
function useRealtime(table: string, filter: string | undefined, onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-${filter ?? 'all'}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table, ...(filter ? { filter } : {}) }, onChange)
      .subscribe()
    const onVisible = () => document.visibilityState === 'visible' && onChange()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      supabase.removeChannel(channel)
    }
  }, [table, filter, onChange])
}

export function useLists() {
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('lists').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else {
      setError(null)
      setLists(data as List[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])
  useRealtime('lists', undefined, load)

  const save = async (l: Partial<List> & Pick<List, 'name' | 'color' | 'icon'>) => {
    const { id, ...rest } = l
    const { error } = id
      ? await supabase.from('lists').update(rest).eq('id', id)
      : await supabase.from('lists').insert(rest)
    if (error) alert(error.message)
    load()
  }
  const remove = async (id: string) => {
    setLists((ls) => ls.filter((x) => x.id !== id))
    await supabase.from('lists').delete().eq('id', id)
    load()
  }
  return { lists, loading, error, save, remove }
}

export function useItems(listId: string) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data } = await supabase.from('items').select('*').eq('list_id', listId).order('position', { ascending: true })
    if (data) setItems(data as Item[])
    setLoading(false)
  }, [listId])

  useEffect(() => {
    load()
  }, [load])
  useRealtime('items', `list_id=eq.${listId}`, load)

  const add = async (i: { title: string; description: string | null; amount: number; category: string | null }) => {
    const min = items.length ? Math.min(...items.map((x) => x.position)) : 0
    await supabase.from('items').insert({ ...i, list_id: listId, position: min - 1 })
    load()
  }
  const update = async (id: string, patch: Partial<Item>) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    await supabase.from('items').update(patch).eq('id', id)
  }
  const remove = async (id: string) => {
    setItems((xs) => xs.filter((x) => x.id !== id))
    await supabase.from('items').delete().eq('id', id)
  }
  const clearChecked = async () => {
    setItems((xs) => xs.filter((x) => !x.checked))
    await supabase.from('items').delete().eq('list_id', listId).eq('checked', true)
  }
  return { items, loading, add, update, remove, clearChecked }
}

/** Past item titles (all lists) for autocomplete. */
export async function fetchSuggestions(): Promise<{ title: string; category: string | null }[]> {
  const { data } = await supabase
    .from('items')
    .select('title, category')
    .order('created_at', { ascending: false })
    .limit(500)
  const seen = new Set<string>()
  const out: { title: string; category: string | null }[] = []
  for (const r of (data ?? []) as { title: string; category: string | null }[]) {
    const k = r.title.trim().toLowerCase()
    if (!seen.has(k)) {
      seen.add(k)
      out.push(r)
    }
  }
  return out
}
