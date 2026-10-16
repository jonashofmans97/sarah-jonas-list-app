export interface List {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  created_at: string
}

export interface Item {
  id: string
  list_id: string
  title: string
  description: string | null
  amount: number
  category: string | null
  checked: boolean
  position: number
  created_at: string
}

export type Person = 'Kokki' | 'Peppi'
