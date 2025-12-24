import React from 'react';

export type Suggestion = { id: string; title: string; subtitle?: string; imageUrl?: string; meta?: any };


interface UseAutocompleteOptions {
  fetcher: (query: string) => Promise<Suggestion[]>;
  debounceMs?: number;
  minQueryLength?: number;
  cacheDurationMs?: number;
  initialResults?: Suggestion[];
}

export default function useAutocomplete({
  fetcher,
  debounceMs = 300,
  minQueryLength = 1,
  cacheDurationMs = 5 * 60 * 1000,
  initialResults = [],
}: UseAutocompleteOptions) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Suggestion[]>(initialResults);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const cacheRef = React.useRef(new Map<string, { ts: number; data: Suggestion[] }>());
  const lastRequestedRef = React.useRef('');
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (query.length < minQueryLength) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    // check cache
    const cached = cacheRef.current.get(query);
    if (cached && Date.now() - cached.ts < cacheDurationMs) {
      setResults(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      lastRequestedRef.current = query;
      try {
        const data = await fetcher(query);
        // only apply if query still same
        if (lastRequestedRef.current === query) {
          setResults(data);
          cacheRef.current.set(query, { ts: Date.now(), data });
          setLoading(false);
          setError(null);
          setActiveIndex(null);
        }
      } catch (err: any) {
        if (lastRequestedRef.current === query) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    }, debounceMs);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, fetcher, debounceMs, minQueryLength, cacheDurationMs]);

  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
    setActiveIndex(null);
  }
  function reset() {
    setQuery('');
    setResults([]);
    setActiveIndex(null);
    setError(null);
    setLoading(false);
  }

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    isOpen,
    activeIndex,
    setActiveIndex,
    open,
    close,
    reset,
  } as const;
}