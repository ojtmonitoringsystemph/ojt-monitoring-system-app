export const uselocalStorage = {
  set<T = unknown>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save key "${key}" to localStorage:`, error);
    }
  },

  get<T = unknown>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Failed to read key "${key}" from localStorage:`, error);
      return null;
    }
  },

  update<T = unknown>(key: string, updater: (current: T | null) => T): void {
    try {
      const current = uselocalStorage.get<T>(key);
      const updated = updater(current);
      uselocalStorage.set<T>(key, updated);
    } catch (error) {
      console.error(`Failed to update key "${key}" in localStorage:`, error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove key "${key}" from localStorage:`, error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  },
};
