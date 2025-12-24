// File: src/api/fakeAutocompleteApi.ts
// Simple fake API for local development (no real network calls)

// import type { Suggestion } from '../components/Autocomplete';

const mockDatabase: any[] = [
  { id: '1', title: 'Apple', subtitle: 'Fruit', imageUrl: 'https://via.placeholder.com/32' },
  { id: '2', title: 'Banana', subtitle: 'Fruit', imageUrl: 'https://via.placeholder.com/32' },
  { id: '3', title: 'Cherry', subtitle: 'Fruit', imageUrl: 'https://via.placeholder.com/32' },
  { id: '4', title: 'Avocado', subtitle: 'Fruit', imageUrl: 'https://via.placeholder.com/32' },
  { id: '5', title: 'Carrot', subtitle: 'Vegetable', imageUrl: 'https://via.placeholder.com/32' },
  { id: '6', title: 'Cabbage', subtitle: 'Vegetable', imageUrl: 'https://via.placeholder.com/32' },
  { id: '7', title: 'Blueberry', subtitle: 'Berry', imageUrl: 'https://via.placeholder.com/32' },
  { id: '8', title: 'Broccoli', subtitle: 'Vegetable', imageUrl: 'https://via.placeholder.com/32' },
];

/**
 * Simulated API fetch (returns filtered mock data)
 * @param query - search term
 * @param delayMs - simulate network delay (default 300ms)
 */
export async function fakeAutocompleteApi(query: string, delayMs = 300): Promise<any[]> {
  if (!query.trim()) return [];

  const lower = query.toLowerCase();
  const filtered = mockDatabase.filter((item) =>
    item.title.toLowerCase().includes(lower)
  );

  // Simulate network latency
  await new Promise((res) => setTimeout(res, delayMs));

  return filtered;
}

// Example usage inside Autocomplete
// import { fakeAutocompleteApi } from '../api/fakeAutocompleteApi';
//
// <Autocomplete
//   loadSuggestions={(q) => fakeAutocompleteApi(q)}
//   placeholder="Search fruits and vegetables..."
// />

// To replace a real API call:
// - Remove apiUrl prop
// - Pass loadSuggestions={fakeAutocompleteApi}
// - Done! You now have a working fake API without network requests.
