import {
  ShoppingCart, ShoppingBasket, Store, Utensils, Apple, Carrot, Pizza, Cake, Coffee, Wine, Beer,
  Sofa, Bed, Bath, Lamp, Home, Hammer, Wrench, Shirt, Pill, Gift, Plane, Car, Book, Dumbbell,
  PawPrint, Baby, Gamepad2, Music, Film, Package, Heart, Star, Sparkles, Leaf, ListChecks,
  type LucideIcon,
} from 'lucide-react'

export const ICONS: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  'shopping-basket': ShoppingBasket,
  store: Store,
  food: Utensils,
  apple: Apple,
  carrot: Carrot,
  pizza: Pizza,
  cake: Cake,
  coffee: Coffee,
  wine: Wine,
  beer: Beer,
  sofa: Sofa,
  bed: Bed,
  bath: Bath,
  lamp: Lamp,
  home: Home,
  hammer: Hammer,
  wrench: Wrench,
  shirt: Shirt,
  pill: Pill,
  gift: Gift,
  plane: Plane,
  car: Car,
  book: Book,
  dumbbell: Dumbbell,
  paw: PawPrint,
  baby: Baby,
  gamepad: Gamepad2,
  music: Music,
  film: Film,
  package: Package,
  heart: Heart,
  star: Star,
  sparkles: Sparkles,
  leaf: Leaf,
  list: ListChecks,
}

export function ListIcon({ name, size = 22, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name] ?? ListChecks
  return <Icon size={size} className={className} />
}

export const COLORS = [
  '#3b82f6', '#06b6d4', '#14b8a6', '#22c55e', '#eab308',
  '#f97316', '#ef4444', '#ec4899', '#a855f7', '#6366f1',
]
