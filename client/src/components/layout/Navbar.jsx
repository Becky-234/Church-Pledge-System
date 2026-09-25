import { useState, useRef, useEffect } from 'react'
import { Menu, ChevronDown, Search, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const Navbar = ({ onMenuClick, onSearch }) => {
  const { user } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    onSearch?.(value)
  }

  const clearSearch = () => {
    setSearchValue('')
    onSearch?.('')
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 lg:px-6 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-white/80 hover:text-primary-600 text-secondary-600 transition lg:hidden shrink-0"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex justify-center">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search members, pledges..."
            className="w-full pl-11 pr-9 py-2 text-sm rounded-lg bg-white/60 border border-white/60 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white outline-none transition placeholder:text-secondary-400"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="relative justify-self-end" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/80 transition"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm shadow-primary-500/30">
            {initials || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-secondary-800">{user?.name}</p>
            <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-secondary-400 hidden sm:block transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-white/60 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-secondary-800">{user?.name}</p>
              <p className="text-xs text-secondary-500">{user?.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar