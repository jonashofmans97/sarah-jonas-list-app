import type { Person } from './types'

const ME = 'me'
const DEFAULT_LIST = 'defaultListId'
const STARTUP = 'startupHandled'

export const getMe = (): Person | null => {
  const v = localStorage.getItem(ME)
  return v === 'Kokki' || v === 'Peppi' ? v : null
}
export const setMe = (p: Person) => localStorage.setItem(ME, p)

// Default list is stored per phone (localStorage).
export const getDefaultList = () => localStorage.getItem(DEFAULT_LIST)
export const setDefaultList = (id: string | null) =>
  id ? localStorage.setItem(DEFAULT_LIST, id) : localStorage.removeItem(DEFAULT_LIST)

// Redirect to the default list only once per app launch.
export const startupHandled = () => sessionStorage.getItem(STARTUP) === '1'
export const markStartupHandled = () => sessionStorage.setItem(STARTUP, '1')
