// File: src/components/Autocomplete.tsx
// Production-ready, reusable Autocomplete component (TypeScript + Tailwind)
// Default export: Autocomplete

import React from 'react';
import useAutocomplete from './hooks';

export type Suggestion = { id: string; title: string; subtitle?: string; imageUrl?: string; meta?: any };

export interface AutocompleteProps {
  apiUrl?: string; // optional if using loadSuggestions prop
  loadSuggestions?: (query: string) => Promise<Suggestion[]>;
  minQueryLength?: number;
  debounceMs?: number;
  maxResults?: number;
  cacheDurationMs?: number;
  initialResults?: Suggestion[];
  placeholder?: string;
  renderItem?: (item: Suggestion, isActive: boolean) => React.ReactNode;
  onSelect?: (item: Suggestion) => void;
  className?: string;
}

export default function Autocomplete({
  apiUrl,
  loadSuggestions,
  minQueryLength = 1,
  debounceMs = 300,
  maxResults = 10,
  cacheDurationMs = 5 * 60 * 1000,
  initialResults = [],
  placeholder = 'Search...',
  renderItem,
  onSelect,
  className = '',
}: AutocompleteProps) {
  if (!apiUrl && !loadSuggestions) {
    throw new Error('Autocomplete: either apiUrl or loadSuggestions must be provided');
  }

  const fetcher = React.useCallback(
    async (q: string) => {
      if (loadSuggestions) return loadSuggestions(q);
      const res = await fetch(`${apiUrl}?q=${encodeURIComponent(q)}&limit=${maxResults}`);
      if (!res.ok) throw new Error('Network error');
      return (await res.json()) as Suggestion[];
    },
    [apiUrl, loadSuggestions, maxResults]
  );

  const {
    query,
    setQuery,
    results,
    isOpen,
    activeIndex,
    setActiveIndex,
    open,
    close,
    loading,
    error,
    reset,
  } = useAutocomplete({
    fetcher,
    debounceMs,
    minQueryLength,
    cacheDurationMs,
    initialResults,
  });

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listId = React.useId();

  React.useEffect(() => {
    // close on outside click
    function onDoc(e: MouseEvent) {
      if (!inputRef.current) return;
      if (e.target instanceof Node && !inputRef.current.parentElement?.contains(e.target)) {
        close();
      }
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [close]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      open();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min((i ?? -1) + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max((i ?? results.length) - 1, 0));
    } else if (e.key === 'Enter' && activeIndex != null && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      close();
    }
  }

  function handleSelect(item: Suggestion) {
    setQuery(item.title);
    onSelect?.(item);
    close();
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex items-center">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => open()}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring focus:ring-opacity-50"
        />
        {loading && (
          <div className="ml-2 text-sm opacity-70" aria-hidden>
            ...
          </div>
        )}
      </div>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white shadow-lg p-1 text-sm"
        >
          {error && (
            <li role="alert" className="p-2 text-red-600">
              {error.message || 'Error'}
            </li>
          )}

          {!loading && results.length === 0 && !error && (
            <li className="p-2 text-gray-500">No results</li>
          )}

          {results.map((r, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li
                key={r.id}
                role="option"
                aria-selected={isActive}
                onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                onClick={() => handleSelect(r)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 ${isActive ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
              >
                {renderItem ? (
                  renderItem(r, isActive)
                ) : (
                  <>
                    {r.imageUrl && <img src={r.imageUrl} alt="" className="h-8 w-8 rounded object-cover" />}
                    <div className="flex flex-col">
                      <span className="truncate font-medium">{r.title}</span>
                      {r.subtitle && <span className="truncate text-xs text-gray-500">{r.subtitle}</span>}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}




